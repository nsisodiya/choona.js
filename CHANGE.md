
Change Log
===========

Latest Release
===============


Older releases
=============
* 1.3.12 - on 8 March 2015

Fixed bug on event binding. currNode can be null

* 1.3.9 - on 8 Feb, 2015

Fixed bug on event binding and Live events

* 1.3.8 - on 4 Jan, 2015

Fixed bug : multiple subViews was not loading !

* 1.3.4 - on 1 Jan 2015

Now, Id will be generated automatically. You need now to pass id when loading any AppView or subView

* 1.3.3 - on 26 Dec 2014

Complete revamp of code base

added klass.js, Everything in Choona now extend from klass.js

* 1.3.2		

7 March 2014 -- Throw error when unable to find DOM element for loading a module.
 
* 1.3.1		

Added Support for Inheritance between modules by
            Adding choona.extendModule function

* 1.3.0		

Removed Backbone.js, As Now this Library support EventBus,
            Added Code for EventBus.

* 1.2.1		

Added support for template property.
            
* 1.2 		

Added Concept of EventBus,
            Added Local Event Handling using Backbone.js
            Removed amplify.js
            modified Erase UI, 
            Added startApp Method, loadApplication is removed now
            AppCore now accept Data Object rather that argument list,
            removed start() function for ApplicationModule.

* 1.0.1		

Added document.querySelector
