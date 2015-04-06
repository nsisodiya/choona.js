(function() {
  "use strict";

  choona.Settings.GlobalEventBus = new choona.EventBus();

  var log = choona.Util.log;
  var logError = choona.Util.logError;

  choona.View = choona.Base.extend({
    initialize: function(moduleConf, subModuleConf) {
      choona.Base.call(this);

      if (moduleConf.id === undefined) {
        moduleConf.id = choona.uniqueIdManager.getId();
        var d = document.createElement("div");
        d.setAttribute("id", moduleConf.id);

        if (subModuleConf !== undefined) {
          subModuleConf.parentNode.appendChild(d);
        } else {
          document.body.appendChild(d);
        }
      }

      this.config = moduleConf.config;
      this._viewMetadata = {
        eventBus: choona.Settings.GlobalEventBus,
        topicList: {},
        subModuleList: {},
        id: moduleConf.id,
        eventsMap: {},
        mercykillFunc: null
      };

      if (subModuleConf !== undefined) {
        this._viewMetadata.mercykillFunc = subModuleConf.mercykillFunc;
        this._viewMetadata.eventBus = subModuleConf.parentEventBus;
        this.$ = subModuleConf.parentNode.querySelector("#" + moduleConf.id);
      } else {
        this.$ = document.querySelector("#" + moduleConf.id);
      }

      if (this.$ === null) {
        throw new Error("Unable to Load Module, as I am unable to find id=\"" + moduleConf.id + "\" inside Root DOM");
      }

      //setup this.$el & this.$$ if jQuery present.
      if (window.jQuery !== undefined && typeof window.jQuery === "function") {
        this.$el = this.$$ = window.jQuery(this.$);
      }

      //Loading Template !!
      //TODO -Support for underscore template
      var str = "";
      if (typeof this.template === "string") {
        str = this.template;
      }
      if (typeof this.template === "function") {
        str = this.template();
      }
      this.$.innerHTML = choona.Settings.postTemplateProcessing(str);

      /*
       * Please note that _startIsolatedEventBus() must be called before _subscribeGlobalEvents()
       * because, you need to get event bus for
       * */

      //Start Isolated EventBus , this will be useful for creating third party widget who do not want to create
      // conflicts in naming
      if (this.isolatedEventBus === true) {
        this._viewMetadata.eventBus = new choona.EventBus();
      }

      //subscribeAll globalEvents();
      var self = this;

      if (this.globalEvents !== undefined) {
        choona.Util.for(this.globalEvents, function(methodName, eventName) {
          self.subscribeGlobalEvent(eventName, methodName);
        });
      }

      //subscribe all DOM events !

      if (this.events !== undefined) {
        this.on(this.events);
      }

      //Calling the global preStart function !
      if (typeof choona.Settings.preStart === "function") {
        choona.Settings.preStart.call(this);
      }
      //TODO - You can find all submodule from DOM and load subView

    },
    _getEventBus: function() {
      return this._viewMetadata.eventBus;
    },
    subscribeGlobalEvent: function(topic, methodName) {
      var self = this;
      var callback = function() {
        self[methodName].apply(self, arguments);
      };
      if (this._viewMetadata.topicList[topic] === undefined) {
        this._viewMetadata.topicList[topic] = [];
      }
      var bus = this._getEventBus();
      this._viewMetadata.topicList[topic].push(bus.subscribe(topic, callback));
    },
    unsubscribeGlobalEvent: function(topic) {
      var bus = this._getEventBus();
      if (this._viewMetadata.topicList[topic] !== undefined) {
        this._viewMetadata.topicList[topic].map(function(v, i) {
          bus.unsubscribe(v);
        });
        delete this._viewMetadata.topicList[topic];
      }
    },
    publishGlobalEvent: function(topic) {
      var bus = this._getEventBus();
      bus.publish.apply(bus, arguments);
    },
    loadSubView: function(data) {
      var self = this;
      if (data === undefined) {
        throw new Error("loadSubView : argument received is undefined");
      } else {
        if (data.module === undefined) {
          throw new Error("loadSubView : module cannot be undefined");
        }
      }
      if (data.id === undefined) {
        data.id = choona.uniqueIdManager.getId();
        var d = document.createElement("div");
        d.setAttribute("id", data.id);
        this.$.appendChild(d);
      }

      if (this._viewMetadata.subModuleList[data.id] === undefined) {
        this._viewMetadata.subModuleList[data.id] = new data.module(data, {
          parentNode: this.$,
          parentEventBus: this._getEventBus(),
          mercykillFunc: function() {
            self.removeSubView(data.id);
          }
        });
      } else {
        throw new Error("data.id::" + data.id + " is already contains a module.  Please provide separate id new module");
      }
    },
    killme: function() {
      if (typeof this._viewMetadata.mercykillFunc === "function") {
        this._viewMetadata.mercykillFunc();
      }
    },
    removeSubView: function(id) {
      if (this._viewMetadata.subModuleList[id] !== undefined) {
        this._viewMetadata.subModuleList[id]._endModule();
        delete this._viewMetadata.subModuleList[id];
      }
      //Deletion is needed because if parent get Ended, it should not try to delete the module again.
    },
    on: function(obj) {
      //We use {"eventName hash":"handler"} kind of notation !
      var self = this;
      choona.Util.for(obj, function(methodName, key) {
        key = key.trim().replace(/ +/g, " ");
        var arr = key.split(" ");
        var eventName = arr.shift();
        var hash = arr.join(" ");
        var callback = choona.DomEvents.addLiveEventListener(self.$, eventName, hash, self[methodName], self);
        self._viewMetadata.eventsMap[key] = {
          eventName: eventName,
          callback: callback
        };
      });
    },
    off: function(key) {
      //Unsubscribe dom event
      var v = this._viewMetadata.eventsMap[key];
      if (v !== undefined && typeof v === "object") {
        this.$.removeEventListener(v.eventName, v.callback);
        delete this._viewMetadata.eventsMap[key];
      }
    },
    end: function() {
      log("Ending base View");
    },
    _endModule: function() {

      //call postEnd();
      if (typeof choona.Settings.postEnd === "function") {
        choona.Settings.postEnd.call(this);
      }


      //endAllSubModules
      var self = this;
      choona.Util.for(this._viewMetadata.subModuleList, function(v, id) {
        self.removeSubView(id);
      });

      if (typeof this.end === "function") {
        this.end();
      }

      //unSubscribing All DOM events
      choona.Util.for(this._viewMetadata.eventsMap, function(v, key) {
        self.off(key);
      });

      //Remove all HTML inside this.$
      this.$.innerHTML = "";

      //unSubscribe All globalEvents
      choona.Util.for(this._viewMetadata.topicList, function(v, topic) {
        self.unsubscribeGlobalEvent(topic);
      });

      delete this.$;
      delete this.$el;
      delete this.$$;
      delete this.config;
      log("ended module -> " + this._viewMetadata.id);
      delete this._viewMetadata.id;
      delete this._viewMetadata.subModuleList;
      delete this._viewMetadata.eventBus;
      delete this._viewMetadata.topicList;
      delete this._viewMetadata.eventsMap;
      delete this._viewMetadata;
      choona.Util.for(this, function(v, key) {
        delete self[key];
      });
    }
  });

  choona.loadView = function(moduleConf) {
    if (moduleConf === undefined) {
      throw new Error("choona.loadView received undefined, expecting object");
    } else {
      if (moduleConf.module === undefined) {
        throw new Error("choona.loadView : module is undefined, expecting Function constructor");
      } else {
        return new moduleConf.module(moduleConf);
      }
    }
  };

})();
