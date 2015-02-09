(function() {
  "use strict";

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
    //Replacement for _.each over Objects
    for: function(Obj, callback) {
      for (var i in Obj) {
        if (Obj.hasOwnProperty(i) === true) {
          callback(Obj[i], i);
        }
      }
    },
    addProperty: function(obj, prop, getCallback, setCallback) {
      var v;
      //var v = obj[prop]; //Initialise with Old Property Value
      Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get: function() {
          getCallback(v);
          return v;
        },
        set: function(value) {
          v = value;
          setCallback(v);
        }
      });

    },
    loadHTML: function(ele, str) {
      ele.innerHTML = str;
      //TODO - find any submodule
      //This function can be transferred to choona.View
    }
  };

})();
