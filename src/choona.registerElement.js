/**
 * Created by narendra on 15/3/15.
 */

(function() {
  "use strict";
  choona.nodeToViewMapping = new choona.WeakMap();

  choona.registerElement = function(ViewConstructor) {
    var ElementPrototype = Object.create(HTMLElement.prototype);
    ElementPrototype.createdCallback = function() {
      var view = new ViewConstructor({
        ele: this
      });
      choona.nodeToViewMapping.add(this, view);
      view.createdCallback.apply(view, arguments);
    };
    ElementPrototype.attachedCallback = function() {
      var view = choona.nodeToViewMapping.get(this);
      view.attachedCallback.apply(view, arguments);
    };
    ElementPrototype.detachedCallback = function() {
      var view = choona.nodeToViewMapping.get(this);
      view.detachedCallback.apply(view, arguments);
      view._endModule();
      choona.nodeToViewMapping.remove(this);
    };
    ElementPrototype.attributeChangedCallback = function() {
      var view = choona.nodeToViewMapping.get(this);
      view.attributeChangedCallback.apply(view, arguments);
    };

    ElementPrototype.getIntegerAttribute = function(attrName, attrObj) {
      var val = this.getAttribute(attrName);
      if (val !== null) {
        return parseInt(val, 10);
      } else {
        return attrObj.default;
      }
    };
    ElementPrototype.setIntegerAttribute = function(attrName, newVal, attrObj) {
      if (typeof newVal === "number" && this[attrName] !== newVal + "") {
        this.setAttribute(attrName, newVal);
      }
    };
    ElementPrototype.getBooleanAttribute = function(attr) {
      var boolStringToBoolean = {
        "true": true,
        "false": false,
        null: false,
        "": true
      };
      var val = boolStringToBoolean[this.getAttribute(attr)];
      if (val === undefined) {
        return false;
      } else {
        return val;
      }
    };
    ElementPrototype.setBooleanAttribute = function(attr, newVal) {
      if (this[attr] !== newVal && typeof newVal === "boolean") {
        if (newVal === true) {
          this.setAttribute(attr, "");
        } else {
          this.removeAttribute(attr);
        }
      }
    };

    if (ViewConstructor.prototype.accessors !== undefined) {
      choona.Util.for(ViewConstructor.prototype.accessors, function(attrObj, attrName) {
        var Prop = {};
        Prop[attrName] = {
          get: function() {
            switch (attrObj.type) {
              case "int":
                return this.getIntegerAttribute(attrName, attrObj);
              case "boolean":
                return this.getBooleanAttribute(attrName, attrObj);
              default:
                return this.getAttribute(attrName);
            }
          },
          set: function(newVal) {
            switch (attrObj.type) {
              case "int":
                this.setIntegerAttribute(attrName, newVal, attrObj);
                break;
              case "boolean":
                this.setBooleanAttribute(attrName, newVal, attrObj);
                break;
              default:
                this.setAttribute(attrName, newVal);
                break;
            }
            if (typeof attrObj.afterSet === "function") {
              attrObj.afterSet.apply(choona.nodeToViewMapping.get(this), arguments);
            }
          }
        };
        Object.defineProperties(ElementPrototype, Prop);
      });
    }

    if (typeof document.registerElement === "function") {
      var elementName = ViewConstructor.prototype.tagName.split("-").map(function(v) {
        return v.charAt(0).toUpperCase() + v.slice(1);
      }).join("") + "Element";
      window[elementName] = document.registerElement(ViewConstructor.prototype.tagName, {
        prototype: ElementPrototype
      });
    } else {
      throw "document.registerElement not found, make sure you can included WebComponents Polyfill";
    }


  };

  choona.ElementView = choona.Base.extend({
    initialize: function(data) {
      choona.Base.call(this);
      this.$ = data.ele;
      this.startModule();
    },
    startModule: function() {
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

      this._viewMetadata = {
        eventBus: choona.Settings.GlobalEventBus,
        topicList: {},
        eventsMap: {}
      };


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
        choona.DomEvents.removeEventListener(this.$, v.eventName, v.callback);
        delete this._viewMetadata.eventsMap[key];
      }
    },
    _endModule: function() {

      //call postEnd();
      if (typeof choona.Settings.postEnd === "function") {
        choona.Settings.postEnd.call(this);
      }

      //unSubscribing All DOM events
      var self = this;
      choona.Util.for(this._viewMetadata.eventsMap, function(v, key) {
        self.off(key);
      });

      //Remove all HTML inside this.$
      this.$.innerHTML = "";

      //unSubscribe All globalEvents
      choona.Util.for(this._viewMetadata.topicList, function(v, topic) {
        self.unsubscribeGlobalEvent(topic);
      });
    }

  });
})();
