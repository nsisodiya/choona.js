(function () {
  "use strict";


//TODO - you always need to write initialize function :(
  App.BlogModule = choona.View.extend({
    initialize: function () {
      choona.View.apply(this, arguments);
    },
    template:"This is blog Module",
    start: function () {

    }
  });

  App.SettingModule = choona.View.extend({
    initialize: function () {
      choona.View.apply(this, arguments);
    },
    template:"This is Settings Module",
    start: function () {

    }
  });

  App.main = choona.View.extend({
    initialize: function () {
      choona.View.apply(this, arguments);
    },
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
  });
})();

