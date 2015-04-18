choona.js
=========
A decoupled, event-driven architecture for developing large scale modular JavaScript applications.
Inspired by
* https://www.youtube.com/watch?v=mKouqShWI4o
* https://github.com/eric-brechemier/lb_js_scalableApp
* Backbone Views


Who use choona.js
=================
* Unicommerce (http://www.unicommerce.com/) use choona.js for base architecture for its core product "Uniware". Uniware is India's best SaaS application for end-to-end management of Warehouse Management. Uniware UI is build upon choona.js and other micro frameworks.
* Here is the related blog entry- http://blog.narendrasisodiya.com/2013/09/my-javascript-stack-for-large-scale.html

Size
====
It is very small is size 
(2.9 KB when minified & gZipped)!
(9.2 KB when minified)

Install
==========

```bash
bower install choona.js
```

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
* eventBus for 

Dependancy
============
Nothing

View API
========

Loading application level View
 
## choona.loadView

```javascript
	var <module-object> = choona.loadView({
		module: <Application-View>,
		id : <id-of-container>,
		config: <optional-configuration-object>
	});
```

### Application-View
This is the Application itself. This is the starting point of the code.

### id-of-container
optional - Every module/application need a node to load itself. it is optional parameter, choona.js will create new id automatically.

### optional-configuration-object
This is an optional configuration argument. An Module can read its optional configuration using ```this.config``` 

### Example

```html
    <body>
    </body>
```


```javascript
	//helloWorldApp.js
	var helloWorldApp = choona.View.extend({
		template: '<p id="hello">Hello</p><button id="submitBtn">Submit</button',
		events : {
		    "click #submitBtn" : "onSubmitBtnClick"
		},
		initialize: function(){
		    choona.View.apply(this, arguments);
		},
		onSubmitBtnClick: function(){
		    //text will be changed from Hello --> Hello World
		    this.$$.find("#hello").text("Hello World");
		    alert("Hello, You have clicked on Submit button");
		}
	});
	//Start Application
	new choona.loadView({
		module: helloWorldApp
	});
```

## What is this.$ inside a module ??
Every view is extended from choona.View which is basically base View.
choona.View constructor create some variables inside your view.

you can use following variables 

    this.$
    this.$$
    this.config


```
*	this.$ => Dom Element == document.getElementById(this.id);
*	this.$$ => $(this.$) //If jQuery present then it will be $(this.$) otherwise its value will be undefined
*	this.config => Configuration - <optional-configuration-object>
```

## View API
===============


### this.killme  ==> unload a view
Lets imagine a Module open a child.View

### this.publishGlobalEvent  ==> Send event to other modules
```javascript
	this.publishGlobalEvent(<Topic-Id>, <Object-to-be-published>);
```

Example

```javascript
	this.publishGlobalEvent("NameChanged", {newName:"Narendra"});
```

### this.subscribeGlobalEvent  ==> Receive event from other modules
```javascript
	this.subscribeGlobalEvent(<Topic-Id>, <MethodName>);
```
Example

```javascript
	this.subscribe("NameChanged", "onNameChangedCallback");
```

A better way to do this using event hash in module definition !

```javascript
    myView = choona.View.extend({
        globalEvents:{
            "NameChanged":"onNameChangedCallback"
        },
        onNameChangedCallback: function(val){
            //...
            alert("Your Name has been changed. New name is " + val.newName);
        }
    }}
```

### this.unsubscribeGlobalEvent  ==> Unsubscribe events
**Please note that you do not need to unsubscribe events manually, 
When a view is ended, all its events got unsubscribed automatically**
```javascript
	this.unsubscribeGlobalEvent(<Topic-Id>);
```

### this.loadSubView  ==> Load a subView inside current View
```javascript
	this.loadSubView({
		module: <Sub-View>,
		id : <optional-id-of-container>,
		config: <optional-configuration-object>
	});
```
### this.removeSubView  ==> End a subView
```javascript
	this.removeSubView(<id-of-container>);
```