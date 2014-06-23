/**
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
