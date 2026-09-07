/* global Module */

/* Magic Mirror
 * Module: MMM-GoogleKeep
 *
 * By taxilof
 * MIT Licensed.
 */

Module.register("MMM-GoogleKeep", {


    requiresVersion: "2.1.0", // Required version of MagicMirror

    defaults: {
        updateInterval: 60,
        maxLines: 30,
        unchecked_only: false
    },

    start: function() {
        Log.log("Starting module: " + this.name + " (" + this.identifier + ")");

        var self = this;

        // Include MagicMirror instance id so the shared node_helper can
        // keep per-instance config and route note payloads correctly.
        this.sendSocketNotification("MMM-GoogleKeep-CONFIG", this.getInstanceConfig());
        this.sendSocketNotification("MMM-GoogleKeep-INITIALIZE", this.getInstanceConfig());

        // Flag to check if module is loaded
        this.loaded = false;

        Log.log("update interval is " + this.config.updateInterval);

        // Schedule update timer.
        this.updateTimer = setInterval(function() {
            self.process();
        }, this.config.updateInterval * 1000);
    },

    /**
     * Build the payload sent to the node helper, always including identifier.
     */
    getInstanceConfig: function() {
        return Object.assign({}, this.config, {
            identifier: this.identifier
        });
    },

    getHeader: function() {
        return this.headerData ? this.headerData : "";
    },

    getDom: function() {
        console.log("getting dom");
        Log.log("11getting dom");

        // create element wrapper for show into the module
        var wrapper = document.createElement("div");
        if (this.config.width) {
            wrapper.style.width = this.config.width + "px";
        }

        if (this.noteData) {
            var wrapperDataNotification = document.createElement("div");
            wrapperDataNotification.style.textAlign = "left";
            var noteDataHTML = this.noteData.replace(
                /[<>]/g, ""
            ).replace(
                /(\n)/gm, "<br>"
            ).replace(/  ☐/gm, "└─ ☐");
            Log.log("XXX" + noteDataHTML);
            wrapperDataNotification.innerHTML = noteDataHTML;

            wrapper.appendChild(wrapperDataNotification);
        }
        return wrapper;
    },

    getScripts: function() {
        return [];
    },

    getStyles: function() {
        return [
            "MMM-GoogleKeep.css",
        ];
    },

    // Load translations files
    getTranslations: function() {
        //FIXME: This can be load a one file javascript definition
        return {
            en: "translations/en.json",
            es: "translations/es.json"
        };
    },

    process: function() {
        this.sendSocketNotification("MMM-GoogleKeep-INITIALIZE", this.getInstanceConfig());
    },

    processData: function(data) {
        console.log("processing");
        var self = this;
        this.dataRequest = data;
        if (this.loaded === false) { self.updateDom(self.config.animationSpeed); }
        this.loaded = true;

        // the data if load
        // send notification to helper
        this.sendSocketNotification("MMM-GoogleKeep-NOTIFICATION_TEST", data);
    },

    // socketNotificationReceived from helper
    socketNotificationReceived: function(notification, payload) {
        // Ignore payloads intended for other instances of this module.
        if (payload && payload.identifier && payload.identifier !== this.identifier) {
            return;
        }

        console.log("jup notify: " + payload);
        if (notification === "note_text") {
            this.noteData = payload.text.join("\n");
            this.headerData = payload.header;
            this.loaded = true;
            this.updateDom();
        }
    },
});
