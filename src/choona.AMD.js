// AMD registration happens at the end for compatibility with AMD loaders
(function() {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define("choona", [], function() {
      return choona;
    });
  }
})();
