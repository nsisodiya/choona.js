//     choona.js 1.0.0

//     (c) 2011-2012 Narendra Sisodiya, narendra@narendrasisodiya.com
//     choona.js may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/nsisodiya/choona.js
//     For demos using Choona.js
//     https://github.com/nsisodiya/Demo-Scalable-App


var choona = (function(){

	var Sandbox = function(id){
		this.id = id;
		this.topicList = {};
		this.moduleList = [];
	}

	Sandbox.prototype = {
		subscribe : function(topic, callback){//publish
			this.topicList[topic] = amplify.subscribe(topic, callback);
			return this.topicList[topic];
		},
		unsubscribe : function(topic){
			amplify.unsubscribe(topic, this.topicList[topic]);
		},
		publish: function(topic, val){//public
			amplify.publish(topic, val);
		},
		loadModule: function(id, creator, config){//public
			this.moduleList.push(new AppCore(id, creator, config));
			return this.moduleList[this.moduleList.length - 1];
		},
		
		//@TODO - Remove it from prototype chain, user should not be able to access it
		endAllModules: function(){
			var l = this.moduleList.length;
			for (var i = 0 ; i < l ; i++){
				this.moduleList[i].end();
			}
			this.moduleList.length = 0;
		},
		
		//@TODO - Remove it from prototype chain, user should not be able to access it
		unsubscribeAll: function(){
			for(var topic in this.topicList){
				amplify.unsubscribe(topic, this.topicList[topic]);
				//console.log('cleared topic -> ' + topic);
			}
		},
		//@TODO - Remove it from prototype chain, user should not be able to access it
		eraseUI: function(){
			//@TODO
			document.getElementById(this.id).innerHTML = '';
		}
	}



	var AppCore = function(id, protoObj_Module, config){
	
		var defaultCreator = function(sandbox, config){
			this.sb = sandbox;
			this.id = sandbox.id;			//Id of Container - This may be require to create Unique Ids
			this.$ =  document.getElementById(this.id);		//Container of module @TODO - What if there are multiple ids ? ideally submodule must find DOM node inside Tree.
			this.config = config;
		};
		defaultCreator.prototype = protoObj_Module;
		
		this.sandbox = new Sandbox(id);
		this.module = new defaultCreator( this.sandbox, config);
	
	};

	AppCore.prototype = {

		start: function(){
			this.module.start();
		},
	
		end: function(){
			this.sandbox.endAllModules();
			this.module.end();
			this.sandbox.eraseUI();
			this.sandbox.unsubscribeAll();
			//console.log('ended -> ', this.sandbox.getId());
		}
		
	};
	
	return {
		loadApplication : AppCore
	};

})();
