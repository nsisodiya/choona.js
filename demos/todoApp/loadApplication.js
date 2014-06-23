_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
_.templateSettings.evaluate = /<!--([\s\S]+?)-->/g;
_.templateSettings.escape = /\{\{-(.+?)\}\}/g;

choona.Settings.Global.preStart = function(){
  var self = this;
  $.get(this.template).done(function (data) {
    self.$$.html(_.template(data));
  });
};


choona.Settings.debug= true;
choona.Settings.isConsoleAvailable= true;

var application = new choona.Application({
  id:"todoapp",
  module: App.todoModule
});
