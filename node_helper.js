/* Magic Mirror
 * Node Helper: MMM-GoogleKeep
 *
 * By taxilof
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");

const {PythonShell} = require("python-shell");

module.exports = NodeHelper.create({

    consolePrefix: "[MMM-GoogleKeep_helper]:: ",

    start: function() {
        console.log(this.consolePrefix + "Starting node_helper for module [" + this.name + "]");
        // MagicMirror shares one node_helper per module name. Keep configs and
        // fetch state keyed by frontend instance identifier so multiple
        // MMM-GoogleKeep entries (different noteId values) work independently.
        this.instanceConfigs = {};
        this.fetching = {};
    },


    python_start: function(instanceConfig) {
        const self = this;
        const identifier = instanceConfig && instanceConfig.identifier;

        if (!identifier) {
            console.error(this.consolePrefix + "Missing instance identifier; cannot start fetch");
            return;
        }

        if (this.fetching[identifier]) {
            console.log(this.consolePrefix + "Fetch already in progress for " + identifier);
            return;
        }

        this.fetching[identifier] = true;

        const pyshell = new PythonShell("modules/" + this.name + "/script/googlekeep.py", {
            mode: "json",
            args: [JSON.stringify(instanceConfig)]
        });

        pyshell.on("message", function(message) {
            console.log(message);
            if (message.hasOwnProperty("debug")) {
                console.log("[" + self.name + "] " + message.debug);
            }
            if (message.hasOwnProperty("status")) {
                console.log(message.status);
                self.sendSocketNotification("status", {
                    identifier: identifier,
                    action: "status",
                    name: message.status.name,
                    data: message.status.data
                });
            }
            if (message.hasOwnProperty("note_text")) {
                // Attach identifier so only the matching frontend instance updates.
                const payload = Object.assign({}, message.note_text, {
                    identifier: identifier
                });
                self.sendSocketNotification("note_text", payload);
            }
        });

        pyshell.end(function(err) {
            self.fetching[identifier] = false;
            if (err) {
                console.error("[" + self.name + "] python error for " + identifier + ":", err);
                self.sendSocketNotification("error", {
                    identifier: identifier,
                    error: "pyshell-throw",
                    message: err.message || String(err)
                });
                return;
            }
            console.log("[" + self.name + "] finished running for " + identifier);
        });
    },

    // Override socketNotificationReceived method.

    /* socketNotificationReceived(notification, payload)
     * This method is called when a socket notification arrives.
     *
     * argument notification string - The identifier of the noitication.
     * argument payload mixed - The payload of the notification.
     */
    socketNotificationReceived: function(notification, payload) {
        if (notification === "MMM-GoogleKeep-NOTIFICATION_TEST") {
            console.log("helper Working notification system.");
            // Send notification
            this.sendNotificationTest(this.anotherFunction()); //Is possible send objects :)
            return;
        }

        if (notification === "MMM-GoogleKeep-CONFIG") {
            if (!payload || !payload.identifier) {
                console.error(this.consolePrefix + "CONFIG missing identifier");
                return;
            }
            this.instanceConfigs[payload.identifier] = payload;
            return;
        }

        if (notification === "MMM-GoogleKeep-INITIALIZE") {
            // Prefer payload from the sender; fall back to stored config for that id.
            var instanceConfig = null;
            if (payload && payload.identifier) {
                instanceConfig = Object.assign(
                    {},
                    this.instanceConfigs[payload.identifier] || {},
                    payload
                );
                this.instanceConfigs[payload.identifier] = instanceConfig;
            }

            if (!instanceConfig || !instanceConfig.identifier || !instanceConfig.noteId) {
                console.error(this.consolePrefix + "INITIALIZE missing identifier/noteId", payload);
                return;
            }

            this.python_start(instanceConfig);
            this.sendSocketNotification("status", {
                identifier: instanceConfig.identifier,
                action: "status",
                name: "initialized"
            });
        }
    },

    // Example function send notification test
    sendNotificationTest: function(payload) {
        this.sendSocketNotification("MMM-GoogleKeep-NOTIFICATION_TEST", payload);
    },
});
