var choona = (function(){

	var Sandbox = function(id){
		this.id = id;
		this.topicList = {};
		this.moduleList = [];
	}

	Sandbox.prototype = {
		getId : function(){
			return this.id;
		},
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
		unsubscribeAll: function(){
			for(var topic in this.topicList){
				amplify.unsubscribe(topic, this.topicList[topic]);
				//console.log('cleared topic -> ' + topic);
			}
		},
		eraseUI: function(){
			document.getElementById(this.id).innerHTML = '';
		},
		createChildModule: function(id, creator, config){//public
			this.moduleList.push(new AppCore(id, creator, config));
			return this.moduleList[this.moduleList.length - 1];
		},
		endChildModules: function(){
			var l = this.moduleList.length;
			for (var i = 0 ; i < l ; i++){
				this.moduleList[i].end();
			}
			this.moduleList.length = 0;
		}
	}



	var AppCore = function(id, protoObj_Module, config){
	
		var defaultCreator = function(sandbox, config){
			this.sb = sandbox;
			this.id = sandbox.getId();			//Id of Container - This may be require to create Unique Ids
			this.$ =  document.getElementById(this.id);		//Container of mudule
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
			this.sandbox.endChildModules();
			this.module.end();
			this.sandbox.eraseUI();
			this.sandbox.unsubscribeAll();
			//console.log('ended -> ', this.sandbox.getId());
		}
		
	};
	
	return {
		createModule : AppCore
	};

})();


