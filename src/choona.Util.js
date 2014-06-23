//choona.Util (Utility Layer)
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


