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



(function() {
  "use strict";
  choona.Settings.GlobalEventBus = new choona.EventBus();

  //TODO - this should be renamed as choona.ViewLoader
  //TODO - We can remove this, choona.View is sufficient !

  choona.Application = choona.Base.extend({
    initialize: function(moduleConf, subModuleConf) {
      choona.Application.parent.call(this);

      var id = moduleConf.id,
        protoObjModule = moduleConf.module,
        config = moduleConf.config,
        domEle, parentEventBus;

      if (subModuleConf !== undefined) {
        parentEventBus = subModuleConf.parentEventBus;
        domEle = subModuleConf.parentNode.querySelector("#" + id);
      } else {
        parentEventBus = choona.Settings.GlobalEventBus;
        domEle = document.querySelector("#" + id);
      }

      if (typeof id !== "string" || id === "") {
        throw new Error("Id provided is not String or it is a blank sting");
      }
      if (domEle === null) {
        throw new Error("Unable to Load Module, as I am unable to find id=\"" + this.id + "\" inside Root DOM");
      }
      if (protoObjModule === undefined && typeof protoObjModule !== "object") {
        throw new Error("moduleConf.module is undefined or not an object for moduleConf.id = " + this.id);
      }
      //TODO - you are assigning initialize to protoObj , If you load module again and again, this will be overwritten
      /* possible solution -
         var x = Object.create(protoObjModule);
         x.initialize = function(){
         }
         var ModuleConstructor = choona.View.extend(x);
      *
      * */

      if (typeof protoObjModule.initialize !== "function") {
        protoObjModule.initialize = function() {
          choona.View.apply(this, arguments);
        };
      }

      //TODO -=
      /*     Object.create( choona.View --> protoObjModule   -->
       *
       * */
      var ModuleConstructor = choona.View.extend(protoObjModule);
      this.module = new ModuleConstructor(id, domEle, config, parentEventBus);

    },
    endApplication: function() {
      this.module._endModuleResources();
      delete this.module;
    }
  });
})();
