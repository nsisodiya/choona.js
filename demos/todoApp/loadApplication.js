_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
_.templateSettings.evaluate = /<!--([\s\S]+?)-->/g;
_.templateSettings.escape = /\{\{-(.+?)\}\}/g;

choona.Settings.preStart = function(){
  var self = this;
  $.get(this.template).done(function (data) {
    self.$$.html(_.template(data));
  });
};


choona.Settings.debug= true;
choona.Settings.isConsoleAvailable= true;

var app = choona.loadView({
  id:"todoapp",
  module: App.todoModule
});