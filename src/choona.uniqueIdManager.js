(function() {
  "use strict";

  function generateId() {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return "id_" + uuid;
  }

  var UniqueId = choona.Base.extend({
    initialize: function() {
      choona.Base.apply(this, arguments);
      this.collection = [];
    },
    getId: function() {
      var id = generateId();
      while (this.collection.indexOf(id) !== -1) {
        id = generateId();
      }
      this.collection.push(id);
      return id;
    }
  });
  //This is to make a Singleton
  choona.uniqueIdManager = new UniqueId();
})();
