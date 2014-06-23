/**
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
