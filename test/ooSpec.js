define(function (require) {
    var Class = require('oo');

    var isType = function (value, type) {
        return {}.toString.call(value).slice(8, -1).toUpperCase() === type.toUpperCase();
    };

    describe('Class', function () {
        it('Class should be a function', function () {
            expect(isType(Class, 'function')).toBe(true);
        });

        it('If called, it should return a function and the function\'s prototype is instance of Class', function () {
            expect(isType(Class(), 'function')).toBe(true);
            expect(Class().prototype instanceof Class).toBe(true);
        });

        it('Class should have method create', function () {
            expect(isType(Class.create, 'function')).toBe(true);
        });

        it('Class should have method static', function () {
            expect(isType(Class.static, 'function')).toBe(true);
        });
    });

    describe('Class.prototype', function () {
        it ('Class.prototype.constructor should be a function', function () {
            expect(isType(Class.prototype.constructor, 'function')).toBe(true);
        });

        it ('Class.prototype.$self should be Class', function () {
            expect(Class.prototype.$self).toEqual(Class);
        });

        it('Class.prototype.$superClass should be object', function () {
            expect(Class.prototype.$superClass).toEqual(Object);
        });

        it('Class.prototype.$super should be a function', function () {
            expect(isType(Class.prototype.$super, 'function')).toBe(true);
        });
    });

    describe('Class.create', function () {
        var Super;
        beforeEach(function () {
            Super = Class.create({
                constructor: function () {
                    this.property = 'property';
                },
                superProp: 'superProp',
                superMethod: function () {
                    return 'superMethod';
                }
            });
        });

        it('if called with no arguments, it should return a class extends Class', function () {
            var ClassTest = Class.create();
            var instance = new ClassTest();
            expect(isType(ClassTest, 'function')).toBe(true);
            expect(instance instanceof Class).toBe(true);
        });

        it('if called with an argument and the argument is an object,'
            + ' it should return a class has the properties and functions in the argument',
            function () {
                var instance = new Super();
                expect(isType(Super, 'function')).toBe(true);
                expect(instance instanceof Class).toBe(true);
                expect(instance.superMethod()).toEqual('superMethod');
                expect(instance.superProp).toEqual('superProp');
            }
        );

        it('if called with an argument and the argument is a function,'
            + ' it should return a class extends the argument',
            function () {
                var Sub = Class.create(Super);
                var sub = new Sub();
                expect(isType(Sub, 'function')).toBe(true);
                expect(sub instanceof Super).toBe(true);
                expect(sub.superMethod()).toEqual('superMethod');
                expect(sub.superProp).toEqual('superProp');
            }
        );

        it('if called with two arguments and the first is a function, second object'
            + ' it should return a class extends the first and has the properties and functions in the second',
            function () {
                var Sub = Class.create(Super, {
                    subProp: 'subProp',
                    subMethod: function () {
                        return 'subMethod';
                    }
                });
                var sub = new Sub();
                expect(isType(Sub, 'function')).toBe(true);
                expect(sub instanceof Super).toBe(true);
                expect(sub.superMethod()).toEqual('superMethod');
                expect(sub.superProp).toEqual('superProp');
                expect(sub.subMethod()).toEqual('subMethod');
                expect(sub.subProp).toEqual('subProp');
            }
        );

        it('if called with two arguments and the first is a function, second object'
            + ' it should return a class extends the first argument and the properties'
            + ' and functions of Super class can be overrided by the second argument',
            function () {
                var Sub = Class.create(Super, {
                    superProp: 'subProp',
                    superMethod: function () {
                        return 'subMethod';
                    }
                });
                var sub = new Sub();
                expect(isType(Sub, 'function')).toBe(true);
                expect(sub instanceof Super).toBe(true);                
                expect(sub.superMethod()).toEqual('subMethod');
                expect(sub.superProp).toEqual('subProp');
            }
        );

        it('if called with two arguments and the first is Super class, second object'
            + ' it should return a class extends Super and the functions of Super'
            + ' class can be called by the same named functions in the object',
            function () {
                var Sub = Class.create(Super, {
                    constructor: function() {
                        this.$super(arguments);
                    },
                    superProp: 'subProp',
                    superMethod: function () {
                        var result = this.$super(arguments);
                        return result + ' ' + 'subMethod';
                    }
                });
                var sub = new Sub();
                expect(isType(Sub, 'function')).toBe(true);
                expect(sub instanceof Super).toBe(true);
                expect(sub.property).toEqual('property');                
                expect(sub.superMethod()).toEqual('superMethod subMethod');
            }
        );
    });
    
    describe('Class.static', function () {
        it('If called with two arguments or more, should throw error', function () {
            expect(function () {
                Class.static(1, 2);
            }).toThrow();
        });

        it('If called with argument equal to undefined, should throw error', function () {
            expect(function () {
                Class.static();
            }).toThrow();
        });

        it('If called with argument typeof which is not object, should throw error', function () {
            expect(function () {
                Class.static('I am a string!');
            }).toThrow();
        });

        it('If called with argument typeof which is object, return a instance with argument as its prototype',
            function () {
                var argument = {
                    method: function () {
                        return 'I am a method!';
                    }
                };
                var instance = Class.static(argument);
                expect(argument.isPrototypeOf(instance)).toBe(true);
            }
        );
    });

    describe('Class.toString', function () {
        it('Should return \"function Class() { [native code] }\"', function () {
            expect(Class.toString()).toEqual('function Class() { [native code] }');
        });
    });
});