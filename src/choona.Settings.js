(function() {
  "use strict";
  choona.Settings = {
    preStart: function() {

    },
    postEnd: function() {

    },
    postTemplateProcessing: function(str) {
      return str;
    },
    moduleResolver: function(moduleName) {
      //Please Override this function
      //This will be used when you write your subView in HTML format like
      //<myTable></myTable>
      //myTable module can be resolved in several ways like require(myTable), App.myTable etc

      return moduleName;
    },
    debug: false,
    isConsoleAvailable: false
  };
})();
