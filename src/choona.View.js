/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 */

/**
 * choona.BaseView
 * Every View will be Inherited from choona.BaseView
 *
 * @author Narendra Sisodiya
 */

(function() {
  "use strict";

  //TODO - you can rename this to choona.View and all views will be extended from this
  //TODO - like choona.view.extend(...)


  var log = choona.Util.log;
  choona.View = choona.Base.extend({
    initialize: function(moduleConf, subModuleConf) {
      choona.Base.call(this);

      this.config = moduleConf.config;
      this._sandBoxData = {
        eventBus: choona.Settings.GlobalEventBus,
        topicList: {},
        subModuleList: {},
        id: moduleConf.id,
        domEvents: []
      };

      if (typeof moduleConf.id !== "string" || moduleConf.id === "") {
        throw new Error("Id provided is not String or it is a blank sting");
      }

      if (subModuleConf !== undefined) {
        this._sandBoxData.eventBus = subModuleConf.parentEventBus;
        this.$ = subModuleConf.parentNode.querySelector("#" + moduleConf.id);
      } else {
        this.$ = document.querySelector("#" + moduleConf.id);
      }

      if (this.$ === null) {
        throw new Error("Unable to Load Module, as I am unable to find id=\"" + moduleConf.id + "\" inside Root DOM");
      }

      //setup this.$el & this.$$ if jQuery present.
      if (jQuery) {
        this.$el = this.$$ = jQuery(this.$);
      }

      //Loading Template !!
      //TODO -Support for underscore template
      var str;
      if (typeof this.template === "string") {
        str = this.template;
      }
      if (typeof this.template === "function") {
        str = this.template();
      }
      this.$.innerHTML = choona.Settings.postTemplateProcessing(str);

      /*
       * Please note that _startIsolatedEventBus() must be called before _subscribeSandboxEvents()
       * because, you need to get event bus for
       * */

      //Start Isolated EventBus , this will be useful for creating third party widget who do not want to create conflicts in naming
      if (this.isolatedEventBus === true) {
        this._sandBoxData.eventBus = new choona.EventBus();
      }

      //subscribeAll SandboxEvents();
      var self = this;

      if (this.sandboxEvents !== undefined) {
        choona.Util.for(this.sandboxEvents, function(methodName, eventName) {
          self.subscribeSandboxEvent(eventName, methodName);
        });
      }

      //subscribe all DOM events !

      if (this.domEvents !== undefined) {
        this.on(this.domEvents);
      }

      //Calling the global preStart function !
      if (typeof choona.Settings.preStart === "function") {
        choona.Settings.preStart.call(this);
      }

      //TODO - mercikill
      if (typeof this.start === "function") {
        this.start();
        log("started module -> " + this._sandBoxData.id);
      } else {
        //TODO - move all these message to common place !
        //TODO - do we need to show error ?
        throw new Error("moduleConf.module.start is undefined for moduleConf.id = " + this._sandBoxData.id);
      }
    },
    start: function() {
      //This will be override by User !
    },
    _getEventBus: function() {
      return this._sandBoxData.eventBus;
    },
    subscribeSandboxEvent: function(topic, methodName) {
      var self = this;
      var callback = function() {
        self[methodName].apply(self, arguments);
      };
      if (this._sandBoxData.topicList[topic] === undefined) {
        this._sandBoxData.topicList[topic] = [];
      }
      var bus = this._getEventBus();
      this._sandBoxData.topicList[topic].push(bus.subscribe(topic, callback));
      log("subscribed topic -> " + topic);
    },
    unSubscribeSandboxEvent: function(topic) {
      log("unsubscribing topic -> " + topic);
      var bus = this._getEventBus();
      if (this._sandBoxData.topicList[topic] !== undefined) {
        this._sandBoxData.topicList[topic].map(function(v, i) {
          bus.unsubscribe(v);
        });
        delete this._sandBoxData.topicList[topic];
      }
    },
    publishSandboxEvent: function(topic, val) {
      log("publishing topic ->" + topic + " = " + val);
      var bus = this._getEventBus();
      bus.publish.apply(bus, arguments);
    },
    startSubModule: function(data) {
      //TODO - user should be able to load submodule without id

      if (this._sandBoxData.subModuleList[data.id] === undefined) {
        //You cannot load more than 1 module at given Id.
        this._sandBoxData.subModuleList[data.id] = new choona.Application(data, {
          parentNode: this.$,
          parentEventBus: this._getEventBus()
        });
      } else {
        throw new Error("data.id::" + data.id + " is already contains a module.  Please provide separate id new module");
      }
    },
    endSubModule: function(id) {
      if (this._sandBoxData.subModuleList[id] !== undefined) {
        this._sandBoxData.subModuleList[id].endApplication();
        delete this._sandBoxData.subModuleList[id];
      }
      //Deletion is needed because if parent get Ended, it should not try to delete the module again.
    },
    on: function(obj) {
      //We use {"eventName hash":"handler"} kind of notation !
      var self = this;
      choona.Util.for(obj, function(handler, key) {
        key = key.trim().replace(/ +/g, " ");

        var arr = key.split(" ");
        var eventName = arr.shift();
        var hash = arr.join(" ");

        var callback = function(e) {
          if (hash === "") {
            self[handler].call(self, e, e.target);
          } else {
            if (e.target.matches(hash)) {
              self[handler].call(self, e, e.target);
            }
          }
        };
        choona.Util.bindEvent(self.$, eventName, callback);
        self._sandBoxData.domEvents[key] = {
          eventName: eventName,
          callback: callback
        };
      });
    },
    off: function(key) {
      //Unsubscribe dom event
      var v = this._sandBoxData.domEvents[key];
      if (v !== undefined && typeof v === "object") {
        choona.Util.unbindEvent(this.$, v.eventName, v.callback);
        delete this._sandBoxData.domEvents[key];
      }
    },
    _endModuleResources: function() {

      //call postEnd();
      if (typeof choona.Settings.postEnd === "function") {
        choona.Settings.postEnd.call(this);
      }


      //endAllSubModules
      var self = this;
      choona.Util.for(this._sandBoxData.subModuleList, function(v, id) {
        self.endSubModule(id);
      });

      if (typeof this.end === "function") {
        this.end();
      }

      //unSubscribing All DOM events
      this._sandBoxData.domEvents.map(function(v, key) {
        self.off(key);
      });

      //Remove all HTML inside this.$
      this.$.innerHTML = "";

      //unSubscribe All SandboxEvents
      choona.Util.for(this._sandBoxData.topicList, function(v, topic) {
        self.unSubscribeSandboxEvent(topic);
      });



      delete this.$;
      delete this.$el;
      delete this.$$;
      delete this.config;
      log("ended module -> " + this._sandBoxData.id);
      delete this._sandBoxData.id;
      delete this._sandBoxData.subModuleList;
      delete this._sandBoxData.eventBus;
      delete this._sandBoxData.topicList;
      delete this._sandBoxData.domEvents;
      delete this._sandBoxData;
    }
  });


})();
