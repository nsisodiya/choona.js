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

(function () {
  "use strict";


  // Caches a local reference to `Element.prototype` for faster access.
  var ElementProto = (typeof Element !== "undefined" && Element.prototype) || {};

  // Cross-browser event listener shims
  var elementAddEventListener = ElementProto.addEventListener || function (eventName, listener) {
    return this.attachEvent("on" + eventName, listener);
  };
  var elementRemoveEventListener = ElementProto.removeEventListener || function (eventName, listener) {
    return this.detachEvent("on" + eventName, listener);
  };
  ElementProto.matchesSelector =
    ElementProto.matches ||
    ElementProto.webkitMatchesSelector ||
    ElementProto.mozMatchesSelector ||
    ElementProto.msMatchesSelector;

  if (!ElementProto.matches) {
    ElementProto.matches = ElementProto.matchesSelector;
  }



  choona.BaseModule = choona.Base.extend({
    initialize: function (id, $, config, parentEventBus) {
      choona.BaseModule.parent.call(this);

      var self = this;
      this.$ = $;
      this.config = config;

      this._sandBoxData = {
        eventBus : parentEventBus,
        topicList : {},
        subModuleList : {},
        id : id,
        domEvents: []
      };

      //setup this.$el & this.$$ if jQuery present.
      if (jQuery) {
        this.$el = this.$$ = jQuery(this.$);
      }

      //Loading Template !!
      //TODO -Support for underscore template
      if (typeof this.template === "string") {
        this.$.innerHTML = this.template;
      }
      if (typeof this.template === "function") {
        this.$.innerHTML = this.template();
      }

      /*
       * Please note that _startIsolatedEventBus() must be called before _subscribeSandboxEvents()
       * because, you need to get event bus for
       * */

      //Start Isolated EventBus , this will be useful for creating third party widget who do not want to create conflicts in naming
      if (this.isolatedEventBus === true) {
        this._sandBoxData.eventBus = new choona.EventBus();
      }

      //subscribeAll SandboxEvents();

      if (this.sandboxEvents !== undefined) {
        choona.Util.for(this.sandboxEvents, function (methodName, eventName) {
          self.subscribeSandboxEvent(eventName, methodName);
        });
      }

      //subscribe all DOM events !

      if (this.domEvents !== undefined) {
        this.on(this.domEvents);
      }

      //Calling the global preStart function !
      if (typeof choona.Settings.Global.preStart === "function") {
        choona.Settings.Global.preStart.call(this);
      }

      //TODO - mercikill
      if (typeof this.start === "function") {
        this.start();
        choona.Util.log("started module -> " + this._sandBoxData.id);
      } else {
        throw new Error("moduleConf.module.start is undefined for moduleConf.id = " + this._sandBoxData.id);
      }
    },
    _getEventBus: function () {
      return this._sandBoxData.eventBus;
    },
    subscribeSandboxEvent: function (topic, methodName) {
      var self = this;
      var callback = function () {
        self[methodName].apply(self, arguments);
      };
      if (this._sandBoxData.topicList[topic] === undefined) {
        this._sandBoxData.topicList[topic] = [];
      }
      var bus = this._getEventBus();
      this._sandBoxData.topicList[topic].push(bus.subscribe(topic, callback));
      choona.Util.log("subscribed topic -> " + topic);
    },
    unSubscribeSandboxEvent: function (topic) {
      choona.Util.log("unsubscribing topic -> " + topic);
      var bus = this._getEventBus();
      if (this._sandBoxData.topicList[topic] !== undefined) {
        this._sandBoxData.topicList[topic].map(function (v, i) {
          bus.unsubscribe(v);
        });
        delete this._sandBoxData.topicList[topic];
      }
    },
    publishSandboxEvent: function (topic, val) {
      choona.Util.log("publishing topic ->" + topic + " = " + val);
      var bus = this._getEventBus();
      bus.publish.apply(bus, arguments);
    },
    startSubModule: function (data) {
      //TODO - user should be able to load submodule without id
      if (typeof data.id !== "string" || data.id === "") {
        throw new Error("Id provided is not String or it is a blank sting");
      }
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
    endSubModule: function (id) {
      this._sandBoxData.subModuleList[id].endApplication();
      delete this._sandBoxData.subModuleList[id];
      //Deletion is needed because if parent get Ended, it should not try to delete the module again.
    },
    on: function (obj) {
      //We use {"eventName hash":"handler"} kind of notation !
      var self = this;
      choona.Util.for(obj, function (handler, key) {
        key = key.trim().replace(/ +/g," ");

        var arr = key.split(" ");
        var eventName = arr.shift();
        var hash = arr.join(" ");

        var callback = function (e) {
          if (hash === "") {
            self[handler].call(self, e, e.target);
          }else{
            if (e.target.matches(hash)) {
              self[handler].call(self, e, e.target);
            }
          }
        };
        elementAddEventListener.call(self.$, eventName, callback, false);
        self._sandBoxData.domEvents[key] = {eventName:eventName, callback:callback };
      });
    },
    off: function (key) {
      //Unsubscribe dom event
      var v = this._sandBoxData.domEvents[key];
      if(v !== undefined && typeof v === "object"){
        elementRemoveEventListener.call(this.$, v.eventName, v.callback);
      }
    },
    _endModuleResources: function () {

      //call postEnd();
      if (typeof choona.Settings.Global.postEnd === "function") {
        choona.Settings.Global.postEnd.call(this);
      }


      //endAllSubModules
      var self = this;
      choona.Util.for(this._sandBoxData.subModuleList, function (v,id) {
        self.endSubModule(id);
      });

      if (typeof this.end === "function") {
        this.end();
      }

      //unSubscribing All DOM events
      this._sandBoxData.domEvents.map(function (v,key) {
        self.off(key);
      });

      //Remove all HTML inside this.$
      this.$.innerHTML = "";

      //unSubscribe All SandboxEvents
      choona.Util.for(this._sandBoxData.topicList, function (v,topic) {
        self.unSubscribeSandboxEvent(topic);
      });



      delete this.$;
      delete this.$el;
      delete this.$$;
      delete this.config;
      choona.Util.log("ended module -> " + this._sandBoxData.id);
      delete this._sandBoxData.id;
      delete this._sandBoxData.subModuleList;
      delete this._sandBoxData.eventBus;
      delete this._sandBoxData.topicList;
      delete this._sandBoxData.domEvents;
      delete this._sandBoxData;
    }
  });


})();
