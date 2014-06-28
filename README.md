IMP Notice
==========
Please use 
  bower install choona.js#1.3.2

for installing, current code in master is UNSTABLE

choona.js
=========
A decoupled, event-driven architecture for developing large scale modular JavaScript applications.
fully inspired by - https://github.com/eric-brechemier/lb_js_scalableApp

Who use choona.js
=================
* Unicommerce (http://www.unicommerce.com/) use choona.js for base architecture for its core product "Uniware". Uniware is India's best SaaS application for end-to-end management of Warehouse Management. Uniware UI is build upon choona.js and other micro frameworks.
* Here is the related blog entry- http://blog.narendrasisodiya.com/2013/09/my-javascript-stack-for-large-scale.html

Size
====
It is very small is size 
(1.3 KB when minified & gZipped)!
(3.6 KB when minified)

License
========
MIT: http://nsisodiya.mit-license.org

Features
=======
* loose coupling of modules
* modules can be tested separately
* replacing any module without affecting other modules
* concept of sub module
* recursive end of submodules
* local eventBus

Install
==========
 bower install choona.js#1.3.2
 

Demo
=============
Visit http://nsisodiya.github.com/Demo-Scalable-App


Dependancy
============
choona.js do not has any dependancy. It is written is Plain JavaScript.
You can use Backbone, jQuery or any other frameworks if you wish. 

API
====
## Syntax - choona.startApp

```javascript
	var <module-object> = choona.startApp({
		id : <id-of-container>, 
		module: <Application-Module>, 
		config: <optional-configuration-object>
	});
```
### id-of-container
Every module/application need a document node to load itself. All the oprations of module/application is restricteded to
that container Node. First argument is id of container node.

### Application-Object
This is the Application itself. This is the starting point of the code.

### optional-configuration-object
This is an optional configuration argument. An Module can read its optional configuration from 

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
*	this.$$ => $(Dom Element) == if jQuery present then it will be equal to $(this.$)
*	this.config => Configuration - <optional-configuration-object>
```
### this.publish  ==> Send event to other modules
```javascript
	this.publish(<Topic-Id>, <Object-to-be-published>);
```

Example

```javascript
	this.publish("NameChanged", {newName:"Narendra"});
```

### this.subscribe  ==> Receive event from other modules
```javascript
	this.sb.subscribe(<Topic-Id>, <Function>);
```
Example

```javascript
	this.subscribe("NameChanged", function(val){
		alert("Your Name has been changed. New name is " + val.newName);
	});
```

A better way to do this using event hash in module definition !

```javascript
    myView = choona.View.extend({
        sandBoxEvents:{
            "NameChanged":"onNameChangedCallback"
        },
        onNameChangedCallback: function(val){
            //...
            alert("Your Name has been changed. New name is " + val.newName);
        }
    }}
```

### this.unsubscribe  ==> Unsubscribe events
**Please note that you do not need to unsubscribe events manually, 
When a view is ended, all its events got unsubscribed automatically**
```javascript
	this.sb.unsubscribe(<Topic-Id>);
```

### this.startSubModule  ==> Load a subView inside current View
```javascript
	this.startSubModule({
		id : <id-of-container>, 
		module: <Sub-View>, 
		config: <optional-configuration-object>
	});
```
### this.endSubModule  ==> End a subView
```javascript
	var <module-object> = this.endSubModule(<id-of-container>);
```