/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 */

/**
 * choona.klass
 *
 * @author Narendra Sisodiya
 */

var choona = {};

choona.klass = (function() {
  "use strict";
  var klass = function(ChildProto) {
    var Child = function() {
      if (typeof ChildProto.initialize === "function") {
        ChildProto.initialize.apply(this, arguments);
      }
    };
    var Parent;
    if (this !== undefined && this.extend === klass) {
      Parent = this;
    } else {
      Parent = {};
      Parent.prototype = {};
    }
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;
    for (var i in ChildProto) {
      if (ChildProto.hasOwnProperty(i)) {
        Child.prototype[i] = ChildProto[i];
      }
    }

    Child.extend = klass;
    Child.parent = Parent;
    return Child;
  };

  klass.Singleton = function(CLASS_OBJ) {
    var CLASS = klass(CLASS_OBJ);
    var singleObj = new CLASS();
    return function() {
      return singleObj;
    };
  };
  return klass;
})();
;/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 *
 *
 */

/**
 *
 //choona.Base
 //-----------

 //It will be base class for all the classes of choona.js, Everything in choona.js inherited from choona.Base

 @author Narendra Sisodiya

 */

choona.Base = choona.klass({});
;/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 *
 *
 */

/**
 * choona.Settings
 * It will be base class for all the classes of choona.js, Everything in choona.js inherited from choona.Base
 *
 * @author Narendra Sisodiya
 */

(function() {
  "use strict";
  choona.Settings = {
    preStart: function() {

    },
    postEnd: function() {

    },
    postTemplateProcessing: function(str) {
      return str;
    },
    debug: false,
    isConsoleAvailable: false
  };
})();
;//choona.Util (Utility Layer)
//-----------

/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 * @author `Narendra Sisodiya`
 *
 *
 **/

(function() {
  "use strict";

  // Caches a local reference to `Element.prototype` for faster access.
  var ElementProto = (typeof Element !== "undefined" && Element.prototype) || {};

  // Cross-browser event listener shims
  var elementAddEventListener = ElementProto.addEventListener || function(eventName, listener) {
    return this.attachEvent("on" + eventName, listener);
  };
  var elementRemoveEventListener = ElementProto.removeEventListener || function(eventName, listener) {
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

  choona.Util = {
    //@msg - Message to be logged
    //@param: {String} msg - message to be logged
    log: function(msg) {
      if (choona.Settings.debug === true && choona.Settings.isConsoleAvailable === true) {
        console.log(msg);
      }
    },
    //@msg - Error Message to be logged
    //choona.Util.logError(), can be used to log error messages to console.
    logError: function(msg) {
      if (choona.Settings.debug === true && choona.Settings.isConsoleAvailable === true) {
        console.error(msg);
      }
    },
    bindEvent: function(ele, eventName, callback) {
      elementAddEventListener.call(ele, eventName, callback, false);
    },
    unbindEvent: function(ele, eventName, callback) {
      elementRemoveEventListener.call(ele, eventName, callback);
    },
    //Replacement for _.each over Objects
    for: function(Obj, callback) {
      for (var i in Obj) {
        if (Obj.hasOwnProperty(i)) {
          callback(Obj[i], i);
        }
      }
    },
    loadHTML: function(ele, str) {
      ele.innerHTML = str;
      //TODO - find any submodule
      //This function can be transferred to choona.View
    }
  };

})();
;/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 */

/**
 * choona.EventBus
 * JavaScript pub/sub design pattern, It will be used for communication between different widgets and modules.
 *
 * @author Narendra Sisodiya
 */

(function() {
  "use strict";
  choona.EventBus = choona.Base.extend({
    initialize: function() {
      this._NewsPaperList = {};
      this._OrderList = [];
    },
    //New Syntax
    on: function() {
      return this.subscribe.apply(this, arguments);
    },
    //Old Syntax
    subscribe: function(newsPaper, address) {
      if ((typeof newsPaper !== "string") || (typeof address !== "function")) {
        return -1;
      }
      var AList = this._NewsPaperList[newsPaper];
      if (typeof AList !== "object") {
        AList = this._NewsPaperList[newsPaper] = [];
      }

      var customer = AList.push(address) - 1;

      return this._OrderList.push({
        newsPaper: newsPaper,
        customer: customer
      }) - 1;
    },
    //New Syntax
    off: function() {
      return this.unsubscribe.apply(this, arguments);
    },
    //Old Syntax
    unsubscribe: function(orderId) {
      var O = this._OrderList[orderId];
      if (O !== undefined) {
        delete this._NewsPaperList[O.newsPaper][O.customer];
      }
    },
    //New Syntax
    trigger: function() {
      this.publish.apply(this, arguments);
    },
    //old Syntax
    publish: function() {
      var Arr = Array.prototype.slice.call(arguments);
      var newsPaper = Arr.slice(0, 1)[0];
      Arr.shift();
      var AddressList = this._NewsPaperList[newsPaper];
      if (typeof AddressList !== "undefined") {
        var l = AddressList.length;
        for (var i = 0; i < l; i++) {
          if (typeof AddressList[i] === "function") {
            AddressList[i].apply(this, Arr);
          }
        }
      }
    }
  });
})();
;/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 */

/**
 * choona.Modal
 * We use Plain JavaScript Objects as modal,
 * You can subscribe/publish events on any modal
 *
 * @author Narendra Sisodiya
 */


(function() {
  "use strict";
  choona.Model = choona.EventBus.extend({
    initialize: function() {
      choona.EventBus.call(this);
    },
    publishModalChanges: function() {
      this.publish("change");
    }
  });
})();
;/**
 * choona.View
 */

(function() {
  "use strict";

  choona.Settings.GlobalEventBus = new choona.EventBus();

  var log = choona.Util.log;
  choona.View = choona.Base.extend({
    initialize: function(moduleConf, subModuleConf) {
      choona.Base.call(this);

      this.config = moduleConf.config;
      this._viewMetadata = {
        eventBus: choona.Settings.GlobalEventBus,
        topicList: {},
        subModuleList: {},
        id: moduleConf.id,
        domEvents: [],
        mercykillFunc: null
      };

      if (typeof moduleConf.id !== "string" || moduleConf.id === "") {
        throw new Error("Id provided is not String or it is a blank sting");
      }

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
        this._viewMetadata.eventBus = new choona.EventBus();
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

      //TODO - we can remove start function as initialize will work fine !!
      if (typeof this.start === "function") {
        this.start();
        log("started module -> " + this._viewMetadata.id);
      }
    },
    start: function() {
      //This will be override by User !
    },
    _getEventBus: function() {
      return this._viewMetadata.eventBus;
    },
    subscribeSandboxEvent: function(topic, methodName) {
      var self = this;
      var callback = function() {
        self[methodName].apply(self, arguments);
      };
      if (this._viewMetadata.topicList[topic] === undefined) {
        this._viewMetadata.topicList[topic] = [];
      }
      var bus = this._getEventBus();
      this._viewMetadata.topicList[topic].push(bus.subscribe(topic, callback));
      log("subscribed topic -> " + topic);
    },
    unSubscribeSandboxEvent: function(topic) {
      log("unsubscribing topic -> " + topic);
      var bus = this._getEventBus();
      if (this._viewMetadata.topicList[topic] !== undefined) {
        this._viewMetadata.topicList[topic].map(function(v, i) {
          bus.unsubscribe(v);
        });
        delete this._viewMetadata.topicList[topic];
      }
    },
    publishSandboxEvent: function(topic, val) {
      log("publishing topic ->" + arguments);
      var bus = this._getEventBus();
      bus.publish.apply(bus, arguments);
    },
    startSubModule: function(data) {
      var self = this;
      if (this._viewMetadata.subModuleList[data.id] === undefined) {
        this._viewMetadata.subModuleList[data.id] = new data.module(data, {
          parentNode: this.$,
          parentEventBus: this._getEventBus(),
          mercykillFunc: function() {
            self.endSubModule(data.id);
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
    endSubModule: function(id) {
      if (this._viewMetadata.subModuleList[id] !== undefined) {
        this._viewMetadata.subModuleList[id]._endModule();
        delete this._viewMetadata.subModuleList[id];
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
        self._viewMetadata.domEvents[key] = {
          eventName: eventName,
          callback: callback
        };
      });
    },
    off: function(key) {
      //Unsubscribe dom event
      var v = this._viewMetadata.domEvents[key];
      if (v !== undefined && typeof v === "object") {
        choona.Util.unbindEvent(this.$, v.eventName, v.callback);
        delete this._viewMetadata.domEvents[key];
      }
    },
    end: function() {
      console.log("Ending base View");
    },
    _endModule: function() {

      //call postEnd();
      if (typeof choona.Settings.postEnd === "function") {
        choona.Settings.postEnd.call(this);
      }


      //endAllSubModules
      var self = this;
      choona.Util.for(this._viewMetadata.subModuleList, function(v, id) {
        self.endSubModule(id);
      });

      if (typeof this.end === "function") {
        this.end();
      }

      //unSubscribing All DOM events
      this._viewMetadata.domEvents.map(function(v, key) {
        self.off(key);
      });

      //Remove all HTML inside this.$
      this.$.innerHTML = "";

      //unSubscribe All SandboxEvents
      choona.Util.for(this._viewMetadata.topicList, function(v, topic) {
        self.unSubscribeSandboxEvent(topic);
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
      delete this._viewMetadata.domEvents;
      delete this._viewMetadata;
    }
  });


})();
;//Choona.Router

// this is just a module !!

// support path like
//
//
//  /blog
//  /blog/*
//  /blog/**
//  /blog/**/*
//  /user/settings/password
//  /user/blog/*  --> /user/blog/1, /user/blog/2, /user/blog/100
//    /user:id




//TODO replace module with widget or component, So that people will not confuse that this is not a requirejs thing..

(function() {
  "use strict";
  choona.Router = choona.View.extend({
    initialize: function() {
      choona.View.apply(this, arguments);
    },
    template: "<router id='router'></router>",
    start: function() {
      this.router = [];
      var self = this;
      choona.Util.for(this.config.routes, function(module, path) {
        self.router.push({
          path: path,
          callback: function() {
            self.endSubModule("router");
            self.startSubModule({
              id: "router",
              module: module
            });
          }
        });
      });


      //TODO - there should be mode for speficify that we want to load all modules on same place with ending previous module
      //TODO OR you want to hide module !

      this.onDocumentClick = function(e) {
        var path = e.target.getAttribute("href");
        var x = self.loadPath(path, false);
        if (x === false) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      };
      this.onPopstate = function(e) {
        var path = document.location.pathname;
        self.loadPath(path, true);
      };



      choona.Util.bindEvent(document, "click", this.onDocumentClick);
      choona.Util.bindEvent(window, "popstate", this.onPopstate);

    },


    loadPath: function(path, back) {

      //TODO Router API in sandbox, need match function !
      //https://github.com/PaulKinlan/leviroutes/blob/master/routes.js
      //https://github.com/olivernn/davis.js/blob/master/davis.js
      // https://github.com/haithembelhaj/RouterJs/blob/master/Router.js
      //https://github.com/flatiron/director/blob/master/lib/director/browser.js
      //todo TODOAPP USING CHOONA.rOUTER

      //TODO - we need to add test cases !!

      var self = this;
      var pathMatched = false;
      this.router.map(function(v, i) {
        if (v.path === path) {
          pathMatched = true;
          if (back === false) {
            history.pushState({}, "", path);
          }
          var x = true;
          if (typeof self.config.before === "function") {
            x = self.config.before(path);
          }
          if (x === true) {
            v.callback();
          }
        }
      });
      return !pathMatched;
    },
    end: function() {
      choona.Util.unbindEvent(document, "click", this.onDocumentClick);
      choona.Util.unbindEvent(window, "popstate", this.onPopstate);
      delete this.onDocumentClick;
      delete this.onPopstate;
    }
  });
})();
