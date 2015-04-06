(function() {
  "use strict";

  var ElementProto = Element.prototype;
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
          while (currNode !== e.currentTarget && currNode !== document && currNode !== null) {
            if (currNode.matches(hash) === true) {
              eventCallback.call(context, e, currNode, currNode.dataset);
              break;
            }
            currNode = currNode.parentNode;
          }
        }
      };
      ele.addEventListener(eventName, callback, false);
      return callback;
    },
    trigger: function(target, type, options) {
      if (options === undefined) {
        options = {};
      }
      var event = document.createEvent("CustomEvent");
      event.initCustomEvent(type, options.bubbles !== false, options.cancelable !== false);
      target.dispatchEvent(event);
    }
  };
})();
