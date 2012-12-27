//     choona.js 1.0.0

//     (c) 2011-2012 Narendra Sisodiya, narendra@narendrasisodiya.com
//     choona.js is distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/nsisodiya/choona.js
//     For demos using Choona.js
//     https://github.com/nsisodiya/Demo-Scalable-App


var choona = (function(){

	var Util = {
		configuration : {},
		log : function(msg) {
			if (this.configuration.debug === true && typeof console == "object"
					&& typeof console.log == "function") {
				console.log(msg);
			}
		},

		loadConfiguration : function(config) {
			Util.configuration = config;
		}

	};
	
	
	

	var Sandbox = function(id){
		this.id = id;
		this.topicList = {};
		this.moduleList = {};
	};

	Sandbox.Private = {
		endAllModules: function(){
			for (var i in this.moduleList ){
				this.moduleList[i].end();
			}
			this.moduleList = {};
		},
		unsubscribeAll: function(){
			for(var topic in this.topicList){
				this.unsubscribe(topic);
			}
		},
		eraseUI: function(){
			document.getElementById(this.id).innerHTML = '';
		},
		getModule: function(id){
			//Get Module by ID, From Module List
			if(this.moduleList[id] === undefined){
				throw new Error("id::" + id  + " is do not has any module. Please use, this.sb.startModule function to load module");
			}else{
				return this.moduleList[id];
			}
		}

	};
	Sandbox.prototype = {
		subscribe : function(topic, callback){//publish
			this.topicList[topic] = amplify.subscribe(topic, callback);
			return this.topicList[topic];
		},
		unsubscribe : function(topic){
			amplify.unsubscribe(topic, this.topicList[topic]);
			delete this.topicList[topic];
			Util.log('cleared topic -> ' + topic);
		},
		publish: function(topic, val){//public
			amplify.publish(topic, val);
		},
		startModule: function(id, creator, config){//public
			if(typeof id != "string" || id == ""){
				throw new Error("Id provided is not String");
			}
			if(this.moduleList[id] === undefined){
				//You cannot load more than 1 module at given Id.
				//There is No module Loaded.
				this.moduleList[id] = new AppCore(id, creator, config);
				this.moduleList[id].start();
			}else{
				throw new Error("id::" + id  + " is already contains a module.  Please provide separate id new module");
			}
		},
		endModule:function(id){
			Sandbox.Private.getModule.call(this,id).end();
			delete this.moduleList[id];
			//Deletion is needed because if parent get Ended, it should not try to delete the module again.
		}
	};

	var AppCore = function(id, protoObj_Module, config){
	
		var defaultCreator = function(sandbox, config){
			this.sb = sandbox;
			this.id = sandbox.id;			//Id of Container - This may be require to create Unique Ids
			this.$ =  document.getElementById(this.id);		//Id must be Unique. You must load Unique ID for any module which has any UI element.
			//@TODO - create a new ID if ID provided is Null or Undefined
			this.config = config;
		};
		defaultCreator.prototype = protoObj_Module;
		
		this.module = new defaultCreator( new Sandbox(id) , config);
	
	};

	AppCore.prototype = {

		start: function(){
			this.module.start();
		},
	
		end: function(){
			Sandbox.Private.endAllModules.call(this.module.sb);
			this.module.end();
			Sandbox.Private.eraseUI.call(this.module.sb);
			Sandbox.Private.unsubscribeAll.call(this.module.sb);
			Util.log('ended -> ' +  this.module.id);
		}
	};
	
	return {
		loadApplication : AppCore,
		configure: Util.loadConfiguration
	};

})();
