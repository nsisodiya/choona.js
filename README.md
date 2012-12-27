choona.js
=========
Small Library for Large Scale Modular JavaScript Developement.

License
========
MIT: http://nsisodiya.mit-license.org


Demo
=============
Visit http://nsisodiya.github.com/Demo-Scalable-App

Dependancy
============
http://amplifyjs.com/


API
====
## Syntax - Choona.loadApplication

```javascript
	var <module-object> = new choona.loadApplication(<id-of-container>, <Application-Module>, <optional-configuration-object>);
```
### <id-of-container>
Every module/application need a document node to load itself. All the oprations of module/application is restricteded to
that container Node. First argument is id of container node.

### <Application-Object>
This is the Application itself. This is the starting point of the code.

### <optional-configuration-object>
This is an optional configuration argument. An Module can read its optinoal configuration from 
```
this.config
```
### Return
Constructor return <module>. <module> has its API.

## Module-object API

### Start function
```javascript
<module-object>.start();
```
This is start the application.

### End function
```javascript
<module-object>.end();
```
This is end the application.
### Example

```javascript
	var module1 = new choona.loadApplication("applicationContainer", {
		start : function(){
			$(this.$).append("<p>THIS IS HEADER PANEL</p>");
	
		},
		end: function(){
	
		}
	});
	module1.start();
	module1.end();
```

You can also split this into multiple files like
```javascript
	//File1.js
	var helloWorldApp = {
		start : function(){
			$(this.$).append("<p>THIS IS HEADER PANEL</p>");
	
		},
		end: function(){
	
		}
	}
	//File2.js
	var module1 = new choona.loadApplication("applicationContainer", helloWorldApp);
	module1.start();
	module1.end();
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
	var <module-object> = this.sb.startModule(<id-of-container>, <Child-Module>, <optional-configuration-object>);
```
### this.sb.endModule  ==> End a child module inside current module
```javascript
	var <module-object> = this.sb.endModule(<id-of-container>);
```

