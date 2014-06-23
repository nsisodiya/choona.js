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

choona.klass = (function () {
  "use strict";
  var klass = function (ChildProto) {
    var Child = function () {
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

  klass.Singleton = function (CLASS_OBJ) {
    var CLASS = klass(CLASS_OBJ);
    var singleObj = new CLASS();
    return function () {
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

(function () {
  "use strict";
  choona.Settings = {
    Global: {
      preStart: function () {

      },
      postEnd: function () {

      },
      templateStrToHtml: function (str) {
        return str;
      }
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

(function () {
  "use strict";
  choona.Util = {
    //@msg - Message to be logged
    //@param: {String} msg - message to be logged
    log: function (msg) {
      if (choona.Settings.debug === true && choona.Settings.isConsoleAvailable === true) {
        console.log(msg);
      }
    },
    //@msg - Error Message to be logged
    //choona.Util.logError(), can be used to log error messages to console.
    logError: function (msg) {
      if (choona.Settings.debug === true && choona.Settings.isConsoleAvailable === true) {
        console.error(msg);
      }
    },
    //Replacement for _.each over Objects
    for: function (Obj, callback) {
      for (var i in Obj) {
        if (Obj.hasOwnProperty(i)) {
          callback(Obj[i], i);
        }
      }
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

(function () {
  "use strict";
  choona.EventBus = choona.Base.extend({
    initialize: function () {
      this._NewsPaperList = {};
      this._OrderList = [];
    },
    //New Syntax
    on: function () {
      return this.subscribe.apply(this, arguments);
    },
    //Old Syntax
    subscribe: function (newsPaper, address) {
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
    off: function () {
      return this.unsubscribe.apply(this, arguments);
    },
    //Old Syntax
    unsubscribe: function (orderId) {
      var O = this._OrderList[orderId];
      if (O !== undefined) {
        delete this._NewsPaperList[O.newsPaper][O.customer];
      }
    },
    //New Syntax
    trigger: function () {
      this.publish.apply(this, arguments);
    },
    //old Syntax
    publish: function () {
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


(function () {
  "use strict";
  choona.Model = choona.EventBus.extend({
    initialize: function () {
      choona.EventBus.call(this);
    },
    publishModalChanges: function () {
      this.publish("change");
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

      this.$ = $;
      this.config = config;

      this._sandBoxData = {
        eventBus : parentEventBus,
        topicList : {},
        subModuleList : {},
        id : id,
        domEvents: []
      };

      this._setUpjQueryElement();
      this._loadTemplate();
      /*
       * Please note that _startIsolatedEventBus() must be called before _subscribeSandboxEvents()
       * because, you need to get event bus for
       * */
      this._startIsolatedEventBus();
      this._subscribeAllSandboxEvents();
      this._subscribeDomEvents();
      this._callPreStart();
      //TODO - mercikill
      this._startModule();
    },
    _startModule: function() {
      if (typeof this.start === "function") {
        this.start();
        choona.Util.log("started module -> " + this._sandBoxData.id);
      } else {
        throw new Error("moduleConf.module.start is undefined for moduleConf.id = " + this._sandBoxData.id);
      }
    },
    _loadTemplate: function () {
      //TODO -Support for underscore template
      if (typeof this.template === "string") {
        this.$.innerHTML = this.template;
      }
      if (typeof this.template === "function") {
        this.$.innerHTML = this.template();
      }
    },
    _startIsolatedEventBus: function () {
      if (this.isolatedEventBus === true) {
        this._sandBoxData.eventBus = this._getNewEventBus();
      }
    },
    _getNewEventBus: function () {
      return new choona.EventBus();
    },
    _getEventBus: function () {
      return this._sandBoxData.eventBus;
    },
    _setUpjQueryElement: function () {
      //setup this.$el & this.$$ if jQuery present.
      if (jQuery) {
        this.$el = this.$$ = jQuery(this.$);
      }
    },
    subscribeSandboxEvent: function (topic, callback) {
      if (this._sandBoxData.topicList[topic] === undefined) {
        this._sandBoxData.topicList[topic] = [];
      }
      var bus = this._getEventBus();
      this._sandBoxData.topicList[topic].push(bus.subscribe(topic, callback));
      choona.Util.log("subscribed topic -> " + topic);
    },
    _subscribeAllSandboxEvents: function () {
      var self = this;
      if (this.sandboxEvents !== undefined) {
        choona.Util.for(this.sandboxEvents, function (methodName, eventName) {
          self.subscribeSandboxEvent(eventName, function () {
            self[methodName].apply(self, arguments);
          });
        });
      }
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
    _subscribeDomEvents: function () {
      var module = this;
      if (module.domEvents !== undefined) {
        choona.Util.for(module.domEvents, function (hander, key) {
          var arr = key.split(" ");
          var eventName = arr.shift();
          var hash = arr.join(" ");
          var callback = function (e) {
            if (hash === "") {
              module[hander].call(module, e, e.target);
            }else{
              if (e.target.matches(hash)) {
                module[hander].call(module, e, e.target);
              }
            }
          };
          var eventId = elementAddEventListener.call(module.$, eventName, callback, false);
          module._sandBoxData.domEvents.push({eventName:eventName, callback:callback});
        });
      }
    },
    _callPreStart: function () {
      if (typeof choona.Settings.Global.preStart === "function") {
        choona.Settings.Global.preStart.call(this);
      }
    },
    _endModuleResources: function () {


      //endAllSubModules
      var module = this;
      choona.Util.for(this._sandBoxData.subModuleList, function (v,id) {
        module.endSubModule(id);
      });

      if (typeof this.end === "function") {
        this.end();
      }

      //unSubscribing All DOM events
      module._sandBoxData.domEvents.map(function (v,i) {
        elementRemoveEventListener.call(module.$, v.eventName, v.callback);
      });

      //Remove all HTML inside this.$
      this.$.innerHTML = "";

      //unSubscribe All SandboxEvents
      choona.Util.for(this._sandBoxData.topicList, function (v,topic) {
        module.unSubscribeSandboxEvent(topic);
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
;/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 */

/**
 * choona.Sandbox
 * Every widget or module has a Sanbox. Sandbox provides a use Interface for widget to widget communication using a event bus
 * and it allow to start and stop sub-modules/sub-widgets.
 *
 * @author Narendra Sisodiya
 */

(function () {
  "use strict";
  choona.Sandbox = choona.Base.extend({


  });
})();
;/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 */

/**
 * choona.Application
 * JavaScript pub/sub design pattern, It will be used for communication between different widgets and modules.
 *
 * @author Narendra Sisodiya
 */



(function () {
  "use strict";
  choona.Settings.GlobalEventBus = new choona.EventBus();

  choona.Application = choona.Base.extend({
    initialize: function (moduleConf, subModuleConf) {
      choona.Application.parent.call(this);

      var id = moduleConf.id,
        protoObjModule = moduleConf.module,
        config = moduleConf.config,
        domEle, parentEventBus;

      if (subModuleConf !== undefined) {
        parentEventBus = subModuleConf.parentEventBus;
        domEle = subModuleConf.parentNode.querySelector("#" + id);
      } else {
        parentEventBus = choona.Settings.GlobalEventBus;
        domEle = document.querySelector("#" + id);
      }

      if (typeof id !== "string" || id === "") {
        throw new Error("Id provided is not String or it is a blank sting");
      }
      if (domEle === null) {
        throw new Error("Unable to Load Module, as I am unable to find id=\"" + this.id + "\" inside Root DOM");
      }
      if (protoObjModule === undefined && typeof protoObjModule !== "object") {
        throw new Error("moduleConf.module is undefined or not an object for moduleConf.id = " + this.id);
      }
      protoObjModule.initialize = function () {
        choona.BaseModule.apply(this, arguments);
      };
      var ModuleConstructor = choona.BaseModule.extend(protoObjModule);
      this.module = new ModuleConstructor(id, domEle, config, parentEventBus);

    },
    endApplication: function () {
      this.module._endModuleResources();
      delete this.module;
    }
  });
})();
