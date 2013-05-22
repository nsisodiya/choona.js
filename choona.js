/*   choona.js 1.3
     (c) 2011-2013 Narendra Sisodiya, narendra@narendrasisodiya.com
     
     choona.js is distributed under the MIT license.
     
     For all details and documentation:
     https://github.com/nsisodiya/choona.js
  
     For demos using Choona.js
     http://nsisodiya.github.com/Demo-Scalable-App/

     Change Log
     1.3		Removed Backbone.js, As Now this Library support EventBus,
     			Added Code for EventBus.
	 1.2.1		Added support for template property.
     			
     1.2 		Added Concept of EventBus,
     			Added Local Event Handling using Backbone.js
			Removed amplify.js
     			modified Erase UI, 
    			Added startApp Method, loadApplication is removed now
    			AppCore now accept Data Object rather that argument list,
    			removed start() function for ApplicationModule.
    			
     			
     1.0.1		Added document.querySelector
     
     
     @depends-on
     	* underscore.js
     	* backbone.js
*/

var EventBus = function () {
    this.NewsPaperList = {};
    this.OrderList = [];
};

EventBus.prototype = {

    subscribe: function (newsPaper, address) {
        if (!(typeof newsPaper === typeof "") || !(typeof address === "function")) {
            return -1;
        }
        var AList = this.NewsPaperList[newsPaper];
        if (!(typeof AList === "object")) {
            AList = this.NewsPaperList[newsPaper] = [];
        }
        
        var customer = AList.push(address) - 1 ;

        return this.OrderList.push({
            newsPaper: newsPaper,
            customer: customer
        }) - 1;
    },
    unsubscribe: function (orderId) {
        var O = this.OrderList[orderId];
        if (!(O === undefined)) {
            delete this.NewsPaperList[O.newsPaper][O.customer];
            delete O;
        }
    },
    publish: function (newsPaper, content) {
        var AddressList = this.NewsPaperList[newsPaper];
        if (!(typeof AddressList === "undefined")) {
            var l = AddressList.length;
            for (var i = 0; i < l; i++) {
                if (typeof AddressList[i] === "function") {
                    AddressList[i].call(this, content);
                }
            }
        }
    }
};

var choona = (function(){
	var util = {
		debug : false,
		log : function(msg) {
			if (this.debug === true && typeof console == "object"
					&& typeof console.log == "function") {
				console.log(msg);
			}
		}
	};
	
	var GlobalEventBus = new EventBus();
	
	var Sandbox = function(id){
		this.id = id;
		this.$ = null;
		this.topicList = {};
		this.moduleList = {};
		this.eventBus = null;
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
			this.$.innerHTML = '';
		},
		getModule: function(id){
			//Get Module by ID, From Module List
			if(this.moduleList[id] === undefined){
				throw new Error("id::" + id  + " is do not has any module. Please use, this.sb.startModule function to load module");
			}else{
				return this.moduleList[id];
			}
		},
		endSandbox: function(){
			//This will delete resource initialised by Sandbox
			
			delete this.$;
			delete this.id;
			delete this.moduleList ;
			delete this.eventBus;
			delete this.topicList;
		}
	};
	
	Sandbox.prototype = {
		subscribe : function(topic, callback){//publish
			this.topicList[topic] = this.eventBus.subscribe(topic, callback);
			util.log('subscribed topic -> ' + topic);
		},
		getNewEventBus : function(){
			return new EventBus();
		},
		unsubscribe : function(topic){
			this.eventBus.unsubscribe(this.topicList[topic]);
			delete this.topicList[topic];
			util.log('cleared topic -> ' + topic);
		},
		publish: function(topic, val){//public
			util.log('published -> ' +  topic  + ' = ' + val);
			this.eventBus.publish(topic, val);
			
		},
		startModule: function(data){//public
			if(typeof data.id != "string" || data.id == ""){
				throw new Error("Id provided is not String or it is a blank sting");
			}
			if(this.moduleList[data.id] === undefined){
				//You cannot load more than 1 module at given Id.
				//There is No module Loaded.
				//@TODO - user should be able to load more modules in one container
				
				data.parentNode = this.$;
				data.parentEventBus = this.eventBus;
				
				this.moduleList[data.id] = startApp(data);

				
			}else{
				throw new Error("data.id::" + data.id  + " is already contains a module.  Please provide separate id new module");
			}
		},
		endModule:function(id){
			Sandbox.Private.getModule.call(this,id).end();
			delete this.moduleList[id];
			//Deletion is needed because if parent get Ended, it should not try to delete the module again.
		}
	};
	var AppCore = function(data){
		var id = data.id,
			node = data.node,
			protoObj_Module = data.module,
			config = data.config,
			eventBus = data.eventBus,
			parentEventBus = data.parentEventBus,
			parentNode = data.parentNode;
		
		if( protoObj_Module === undefined && !(typeof protoObj_Module === typeof {})){
			throw new Error("data.module is undefined for data.id = " + data.id);
			return;
		}
		var defaultCreator = function(sandbox, config){
			this.sb = sandbox;
			this.id = sandbox.id;			//Id of Container - This may be require to create Unique Ids
			if(parentNode === undefined){
				this.$ = document.querySelector( "#" + this.id);
			}else{
				this.$ = parentNode.querySelector( "#" + this.id);
			}
			this.sb.$ = this.$; // SandBox must contains reference to module Container
			if(eventBus === undefined){
				if(parentEventBus === undefined){
					this.sb.eventBus = GlobalEventBus;
				}else{
					this.sb.eventBus = parentEventBus;	
				}
				
			}else{
				this.sb.eventBus = eventBus;
			}
			
			this.config = config;
		};
		defaultCreator.prototype = protoObj_Module;
		
		this.sandbox = new Sandbox(id, node);
		this.module = new defaultCreator(this.sandbox, config);
		
		if(typeof this.module.template === "string"){
			this.module.$.innerHTML = this.module.template;
		}
		
		if(typeof this.module.start === "function"){
			this.module.start();
			
			util.log('started module -> ' + this.module.id);
		}else{
			throw new Error("data.module.start is undefined for data.id = " + this.module.id);
		}
	};
	
	AppCore.prototype = {
		end: function(){
			Sandbox.Private.endAllModules.call(this.sandbox);
			if(typeof this.module.end === "function"){
				this.module.end();	
			}
			Sandbox.Private.eraseUI.call(this.sandbox);
			Sandbox.Private.unsubscribeAll.call(this.sandbox);
			Sandbox.Private.endSandbox.call(this.sandbox);
			util.log('ended module -> ' +  this.module.id);
			
			delete this.module;
			delete this.sandbox;
			
		}
	};
	
	startApp = function(data){
		return new AppCore(data);
	};
	
	
	return {
		startApp: startApp,
		util: util
	};
})();
