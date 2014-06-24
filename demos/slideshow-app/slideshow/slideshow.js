(function () {
  "use strict";


  App.BlogModule = {
    template:"This is blog Module",
    start: function () {

    }
  };

  App.SettingModule = {
    template:"This is Settings Module",
    start: function () {



    }
  };


  App.main = {
    template:"<a href='/dash'>/dashboard</a><br/><a href='/blog'>/blog</a><br/><a href='/settings'>/settings</a><div id='mainModule'></div>",
    start: function () {
      var self = this;
      this.startSubModule({
        id:"mainModule",
        module: choona.Router,
        config : {
          routes: {
            "/blog": App.BlogModule,
            "/settings": App.SettingModule
          }
        }
      });
    }
  };


})();

