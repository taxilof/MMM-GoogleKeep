/* global Module */

/* Magic Mirror
 * Module: MMM-GoogleKeep
 *
 * By taxilof
 * MIT Licensed.
 */

Module.register("MMM-GoogleKeep", {


    requiresVersion: "2.1.0", // Required version of MagicMirror

    start: function() {
        Log.log('Starting module: ' + this.name);

        var self = this;
        var dataRequest = null;
        var dataNotification = null;
        var noteData = null;

        this.sendSocketNotification('MMM-GoogleKeep-CONFIG', this.config);
        this.sendSocketNotification('MMM-GoogleKeep-INITIALIZE', null);

        // Flag to check if module is loaded
        this.loaded = false;

        Log.log("update interval is" + this.config.updateInterval);

        // Schedule update timer.
        setInterval(function() {
            self.process();
        }, this.config.updateInterval * 1000);
    },


    getDom: function() {
        console.log("getting dom");
        Log.log("11getting dom");
        var self = this;


        // create element wrapper for show into the module
        var wrapper = document.createElement("div");
        if (this.noteData) {
            var wrapperDataNotification = document.createElement("div");
            wrapperDataNotification.style.textAlign= "left";
            noteDataHTML = this.noteData.replace(/(\n)/gm,"<br>");
            Log.log('XXX' + noteDataHTML);
            wrapperDataNotification.innerHTML =  noteDataHTML;


            wrapper.appendChild(wrapperDataNotification);
        }
        return wrapper;
    },

    getScripts: function() {
        return [];
    },

    getStyles: function () {
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
        this.sendSocketNotification('MMM-GoogleKeep-INITIALIZE', null);
    },

    processData: function(data) {
        console.log("processing");
        var self = this;
        this.dataRequest = data;
        if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
        this.loaded = true;

        // the data if load
        // send notification to helper
        this.sendSocketNotification("MMM-GoogleKeep-NOTIFICATION_TEST", data);
    },

    // socketNotificationReceived from helper
    socketNotificationReceived: function (notification, payload) {
        console.log('jup notify: ' + payload);
        if(notification === "note_text") {
            this.noteData = payload;
            this.updateDom();
        }
    },
});