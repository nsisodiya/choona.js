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
