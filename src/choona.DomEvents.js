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
  choona.DomEvents = {
    addLiveEventListener: function(ele, eventName, hash, eventCallback, context) {
      var callback = function(e) {
        var currNode = e.target;
        if (hash === "") {
          eventCallback.call(context, e, e.currentTarget, e.currentTarget.dataset);
        } else {
          while (currNode !== e.currentTarget && currNode !== document) {
            if (currNode.matches(hash) === true) {
              eventCallback.call(context, e, currNode, currNode.dataset);
              break;
            }
            currNode = currNode.parentNode;
          }
        }
      };
      this.addEventListener(ele, eventName, callback);
      return callback;
    },
    addEventListener: function(ele, eventName, callback) {
      elementAddEventListener.call(ele, eventName, callback, false);
    },
    removeEventListener: function(ele, eventName, callback) {
      elementRemoveEventListener.call(ele, eventName, callback);
    }
  };

})();
