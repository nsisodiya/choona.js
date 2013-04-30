choona.js
=========
A decoupled, event-driven architecture for developing large scale  modular JavaScript applications.

License
========
MIT: http://nsisodiya.mit-license.org

Features
=======
* loose coupling of modules
* modules can be tested separately
* replacing any module without affecting other modules
* concept of sub module
* recursive end of submodule
* local eventBus
* Id can be repeated for modules


Demo
=============
Visit http://nsisodiya.github.com/Demo-Scalable-App


Dependancy
============
choona.js Use Backbone events internally, you must include them.
You can use jQuery or any other library if you want.
* Underscore.js - http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.1/underscore-min.js
* Backbone.js - http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min.js

API
====
## Syntax - choona.startApp

```javascript
	var <module-object> = choona.startApp({
		id : <id-of-container>, 
		module: <Application-Module>, 
		config: <optional-configuration-object>,
		eventBus: <optional-local-EventBus>
	});
```
### id-of-container
Every module/application need a document node to load itself. All the oprations of module/application is restricteded to
that container Node. First argument is id of container node.

### Application-Object
This is the Application itself. This is the starting point of the code.

### optional-configuration-object
This is an optional configuration argument. An Module can read its optinoal configuration from 

### <local-EventBus>
This is an optional eventBus, for local submodule isolated communication. We will explain it latter.
```
this.config
```
### Return
Constructor return *module*. *module* has its API.

## Module-object API

### End function
```javascript
<module-object>.end();
```
This is end the application.
### Example

```javascript
	var module1 = choona.startApp({
		id: "applicationContainer", 
		module: {
			template: "<p>THIS IS HEADER PANEL</p>",
			start : function(){
			},
			end: function(){
			}
		}
	});
	//module1.end();
```

You can also split this into multiple files like
```javascript
	//File1.js
	var helloWorldApp = {
		template: "<p>THIS IS HEADER PANEL</p>",
		start : function(){
		},
		end: function(){
		}
	}
	//File2.js
	var module1 = new choona.startApp({
		id: "applicationContainer", 
		module: helloWorldApp
	});
	
	//module1.end();
```
## Syntax - Sandbox API
Every Application Module can load multiple modules. Technically there is no difference between
an Applicaton or module or chile module.
Every Module cantains a SANBOX. Every Module can load multiple child modules. 
Every Module can delete its child modules.

How its all happen ? Sanbox is the toolkit of a module. SANBOX provide useful 
methods to load/unload new child modules. One module talk to another using SANBOX.

## What is this.$ inside a module ??

Here it is. Every Module is GIFTED with following variable.

id, $, sb, config


```
*	this.id => Id of module.  <id-of-container> Ex -- "applicationContainer"
*	this.$ => Dom Element == document.getElementById(this.id);
*	$(this.$) === $("#" + this.id) => jQueryfied of container node -- Ex $("#applicationContainer");
*	this.config => Configuration - <optional-configuration-object>
*	this.sb => instance of sandbox associated with module. It provide useful API
```
### this.sb.publish  ==> Send Signals
```javascript
	this.sb.publish(<Topic-Id>, <Object-to-be-published>);
```

Example

```javascript
	this.sb.publish("NameChanged", {newName:"Narendra"});
```

### this.sb.subscribe  ==> Recieve Signals
```javascript
	this.sb.subscribe(<Topic-Id>, <Fuction>);
```

Example

```javascript
	this.sb.subscribe("NameChanged", function(val){
		alert("Your Name has been changed. New name is " + val.newName);
	});
```
### this.sb.unsubscribe  ==> Stop recieving Signals
```javascript
	this.sb.unsubscribe(<Topic-Id>);
```
### this.sb.startModule  ==> Load a child module inside current module
```javascript
	this.sb.startModule({
		id : <id-of-container>, 
		module: <Application-Module>, 
		config: <optional-configuration-object>,
		eventBus: <optional-local-EventBus>
	});
```
### this.sb.endModule  ==> End a child module inside current module
```javascript
	var <module-object> = this.sb.endModule(<id-of-container>);
```

### this.sb.getNewEventBus  ==> Get a local event bus
```javascript
	var myEventBus = this.sb.getNewEventBus();
	//Use is eventBus to while creating new submodules
	this.sb.startModule({
		id : <id-of-container>, 
		module: <Sub-Module>, 
		config: <optional-configuration-object>,
		eventBus: myEventBus
	});
```
