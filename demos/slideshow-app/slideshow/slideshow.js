(function () {
  "use strict";


//TODO - you always need to write initialize function :(
//TODO - you can remove start function and lets code inside initialize function !!

  App.BlogModule = choona.View.extend({
    template:"This is blog Module",
    initialize: function () {
      choona.View.apply(this, arguments);
    }
  });

  App.SettingModule = choona.View.extend({
    template:"This is Settings Module",
    initialize: function () {
      choona.View.apply(this, arguments);
    }
  });

  App.main = choona.View.extend({
    template:"<a href='/dash'>/dashboard</a><br/><a href='/blog'>/blog</a><br/><a href='/settings'>/settings</a><div id='mainModule'></div>",
    initialize: function () {
      choona.View.apply(this, arguments);

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

