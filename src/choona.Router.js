//Choona.Router

// this is just a module !!

//TODO replace module with widget or component, So that people will not confuse that this is not a requirejs thing..

(function() {
  "use strict";
  choona.Router = {

    template: "<router id='router'></router>",
    start: function() {
      this.router = [];
      var self = this;
      choona.Util.for(this.config.routes, function(module, path) {
        self.router.push({
          path: path,
          callback: function() {
            self.endSubModule("router");
            self.startSubModule({
              id: "router",
              module: module
            });
          }
        });
      });

      //TODO unbind these callback when you end router !!

      //TODO - there should be mode for speficify that we want to load all modules on same place with ending previous module
      //TODO OR you want to hide module !


      choona.Util.bindEvent(document, "click", function(e) {
        var path = e.target.getAttribute("href");
        var x = self.loadPath(path, false);
        if (x === false) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      });

      choona.Util.bindEvent(window, "popstate", function(e) {
        var path = document.location.pathname;
        self.loadPath(path, true);
      });

    },
    loadPath: function(path, back) {

      //TODO Router API in sandbox
      //https://github.com/PaulKinlan/leviroutes/blob/master/routes.js
      //https://github.com/olivernn/davis.js/blob/master/davis.js
      // https://github.com/haithembelhaj/RouterJs/blob/master/Router.js
      //https://github.com/flatiron/director/blob/master/lib/director/browser.js
      //todo TODOAPP USING CHOONA.rOUTER

      //TODO - we need to add test cases !!

      var pathMatched = false;
      this.router.map(function(v, i) {
        if (v.path === path) {
          pathMatched = true;
          if (back === false) {
            history.pushState({}, "", path);
          }
          v.callback();
        }
      });
      return !pathMatched;
    },
    end: {

    }
  };
})();
