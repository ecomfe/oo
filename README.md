oo
==

Base library for OO style programming, supports both browser and node

## Usage

```javascript
// var Class = require('oo')
require(['oo'], function(Class) {

    // a base class
    var Super = Class({
        // constructor will be called on instantiation
         constructor: function() {

         },
         // members that will be added to the prototype
         say: function(content) {
             console.log(content)
         }
    });

    // inherits the Super
    var Sub = Class(Super, {
        constructor: function(prop) {
        //  $super method will call the Super Class's method with the same name,
        // in this, is `constructor`
            this.$super(arguments);

            // other code
            this.prop = prop;
        },

        say: function(content) {
            this.$super(arguments);
            console.log(this.prop)
        }
    });

    var sup = new Super();
    sup.say('hi');

    var sub = new Sub('sub');
    sub.say('fuck!');
});
```

## attribute

### Class.prototype.constructor method
if config a constructor, and it is a function, it will be called on instantiation

### Class.prototype.$super method
$super method will call the Super Class's method with the same name;

***notice***
because `$super` internal implementation uses the `arguments.caller`, $super can not be used in strict mode!

###  Class.prototype.$self
this property references the instance's Class:

```javascript
var Base = Class();
var instance = new Base();
instance.$self === Base // true
```

### Class.$superClass
references the super class:

```javascript
var Super = Class();
var Sub = Class(Super);

Sub.$superClass === Super // true

```

### Class.create
Class() equals Class.create()


