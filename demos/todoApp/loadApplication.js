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


//TODO , We need some more compact notation for this,
//Something like jquery plugin

//Todo - you can rename this to choona.startView()
var MainViewLoader = function(data){
  return new data.module({
    id:data.id
  });
};

//TOOD - inside view, you can define id, If user know where you are loading it !!

//TODO - var app = new App.main({});

var app = MainViewLoader({
  id:"todoapp",
  module: App.todoModule,
  config : null
});
