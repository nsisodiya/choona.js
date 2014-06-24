_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
_.templateSettings.evaluate = /<!--([\s\S]+?)-->/g;
_.templateSettings.escape = /\{\{-(.+?)\}\}/g;



choona.Settings.debug= true;
choona.Settings.isConsoleAvailable= true;

//TODO , We need some more compact notation for this,
//Something like jquery plugin


var app = new App.main({
  id:"todoapp"
});
