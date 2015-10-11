eoo
==

Base library for OO style programming, supports both browser and node

## Usage

### inherits Class

Top Class is the ***Class***

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

### inherits Object

This equals ```Object.create``` method.

```javascript
Class.static(obj);
```

## attribute

### Class#constructor
if config a constructor, and it is a function, it will be called on instantiation

### Class#$super
$super method will call the Super Class's method with the same name;

***notice:***
because `$super` internal implementation uses the `arguments.caller`, $super can not be used in strict mode!

###  Class#$self
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
alias of Class

### Class.static
creates a new object with the specified prototype object and properties.
Just equals ```Object.create``` method.

### Class.defineAccessor
quickly generator the accessor for the object;

 ```javascript
 Class.defineAccessor(obj, 'name');
 typeof obj.setName === 'function'; // true
 typeof obj.getName === 'function'; // true
 ```

### Class.defineMembers
Add properties to the function prototype so we can create a sub class first, and then add members to the sub class.
This will enable the function in the added members to use ```this.$super()``` feature;

```javascript
var Super = Class({
    method: function () {
        console.log('super method!');
    }
});
var Sub = Class(Super);
oo.defineMembers(Sub, {
    method: function () {
        this.$super(arguments);
        console.log('sub method');
    }
});

var instance = new Sub();
instance.method(); // 'super method'; 'sub method';

```


### Class.createPrivate
create a private object whose prototype points the first param if has,
and return a token function which accept an object as param,
call the token function with an object, it will return the private part of the object,
because the private part is just a object, you can do any operation on it.
Do not expose the token function to the outside.

```javascript
// MyClass.js
// $private is a secret token function, and used in the module scope.
var $private = Class.createPrivate({
    // this method is on the prototype shared by all instance passed from the $private function
    privatePrototypeMethod: function () {
        return this.getPrivateProp();
    }
});

var MyClass = Class({
    constructor: function () {
        $private(this).privateProp = 'privateProp';
    },
    getPrivateProp: function () {
        return $private(this).privateProp;
    },
    callPrivateMethod: function () {
        $private(this).privatePrototypeMethod.call(this);
    }
});

var my = new MyClass();
alert(my.getPrivateProp()); // 'privateProp'
alert(my.callPrivateMethod()); // 'privateProp'

```
