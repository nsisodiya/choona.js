_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
_.templateSettings.evaluate = /<!--([\s\S]+?)-->/g;
_.templateSettings.escape = /\{\{-(.+?)\}\}/g;



choona.Settings.debug= true;
choona.Settings.isConsoleAvailable= true;


var app = choona.loadView({
  id:"todoapp",
  module: App.main
});