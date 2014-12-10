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
    log: function() {
      if (choona.Settings.debug === true && choona.Settings.isConsoleAvailable === true) {
        console.log.apply(console, arguments);
      }
    },
    //@msg - Error Message to be logged
    //choona.Util.logError(), can be used to log error messages to console.
    logError: function() {
      if (choona.Settings.debug === true && choona.Settings.isConsoleAvailable === true) {
        console.error.apply(console, arguments);
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
