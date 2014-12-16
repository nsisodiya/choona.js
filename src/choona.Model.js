(function() {
  "use strict";
  choona.Model = choona.EventBus.extend({
    initialize: function() {
      choona.EventBus.apply(this, arguments);
      this.loadDefaults();
    },
    loadDefaults: function() {
      var self = this;
      choona.Util.for(this.defaults, function(v, key) {
        self.addProperty(key);
      });
    },
    addProperty: function(key) {
      var self = this;
      choona.Util.addProperty(this,
        key,
        function() {
          //Get Callback
        },
        function(val) {
          //Set Callback
          this.publish("change:" + key);
        });
    },
    publishChange: function() {
      this.publish("change");
    }
  });
})();
