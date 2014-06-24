/**
 * Copyright 2013-14 Narendra Sisodiya, <narendra@narendrasisodiya.com>
 *
 * Licensed under "The MIT License". visit http://nsisodiya.mit-license.org/ to read the License.
 *
 */

/**
 * choona.Application
 * JavaScript pub/sub design pattern, It will be used for communication between different widgets and modules.
 *
 * @author Narendra Sisodiya
 */

//TODO - this should be renamed as choona.ViewLoader
//TODO - We can remove this, choona.View is sufficient !
//TODO - you are assigning initialize to protoObj , If you load module again and again, this will be overwritten
/* possible solution -
 var x = Object.create(protoObjModule);
 x.initialize = function(){
 }
 var ModuleConstructor = choona.View.extend(x);
 *
 * */

//TODO -=
/*     Object.create( choona.View --> protoObjModule   -->
 *
 * */



(function() {
  "use strict";
  choona.Settings.GlobalEventBus = new choona.EventBus();
  choona.Application = choona.Base.extend({
    initialize: function(moduleConf, subModuleConf) {
      choona.Base.call(this);

      var protoObjModule = moduleConf.module;

      if (protoObjModule === undefined && typeof protoObjModule !== "object") {
        throw new Error("moduleConf.module is undefined or not an object for moduleConf.id = " + this.id);
      }
      if (typeof protoObjModule.initialize !== "function") {
        protoObjModule.initialize = function() {
          choona.View.apply(this, arguments);
        };
      }
      var ModuleConstructor = choona.View.extend(protoObjModule);
      this.module = new ModuleConstructor(moduleConf, subModuleConf);
    },
    endApplication: function() {
      this.module._endModuleResources();
      delete this.module;
    }
  });
})();
