_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
_.templateSettings.evaluate = /<!--([\s\S]+?)-->/g;
_.templateSettings.escape = /\{\{-(.+?)\}\}/g;



choona.Settings.debug= true;
choona.Settings.isConsoleAvailable= true;



choona.Settings.preStart = function(){
  var self = this;
  $.get(this.template).done(function (data) {
    self.$$.html(_.template(data));
    self.lazyStart();
  });
};


choona.loadView({
  module: App.SlideShow,
  config: ["img/1.jpg", "img/2.jpg", "img/3.jpg", "img/4.jpg", "img/5.jpg"]
});