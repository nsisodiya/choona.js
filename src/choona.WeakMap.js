/**
 * Created by narendra on 15/3/15.
 */

(function() {
  "use strict";
  choona.WeakMap = choona.Base.extend({
    initialize: function() {
      choona.Base.call(this);
      this.allNodes = [];
    },
    add: function(obj, val) {
      var n = obj.__ELEMENT_TO_VIEW_INDEX__;
      if (n === undefined) {
        this.allNodes.push({
          obj: obj,
          val: val
        });
        obj.__ELEMENT_TO_VIEW_INDEX__ = this.allNodes.length - 1;
      } else {
        throw "Week map Error, object already mapped";
      }
    },
    get: function(obj) {
      var index = obj.__ELEMENT_TO_VIEW_INDEX__;
      if (index !== undefined) {
        return this.allNodes[index].val;
      }
    },
    set: function(obj, val) {
      var index = obj.__ELEMENT_TO_VIEW_INDEX__;
      if (index !== undefined) {
        this.allNodes[index].val = val;
      }
    },
    remove: function(obj) {
      var index = obj.__ELEMENT_TO_VIEW_INDEX__;
      if (index !== undefined) {
        this.allNodes[index] = null;
        delete obj.__ELEMENT_TO_VIEW_INDEX__;
      }
    }
  });

})();
