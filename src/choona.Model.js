(function() {
  "use strict";
  choona.Model = choona.EventBus.extend({
    initialize: function() {
      choona.EventBus.call(this);
    },
    publishChange: function() {
      this.publish("change");
    }
  });
})();
