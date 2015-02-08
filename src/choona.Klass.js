var choona = {};
(function() {
  "use strict";
  var klass = function(ChildProto) {
    var Child = function() {
      if (typeof ChildProto.initialize === "function") {
        ChildProto.initialize.apply(this, arguments);
      }
    };
    var Parent;
    if (this !== undefined && this.extend === klass) {
      Parent = this;
    } else {
      Parent = Object;
    }
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;
    for (var i in ChildProto) {
      if (ChildProto.hasOwnProperty(i) === true) {
        Child.prototype[i] = ChildProto[i];
      }
    }

    Child.extend = klass;
    Child.parent = Parent;
    Child.super = Parent.prototype;
    return Child;
  };
  choona.klass = klass;
})();
