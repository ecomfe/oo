/**
 * @file class 体系测试用例
 * @author exodia(d_xinxin@163.com)
 */
describe(
    'class system test',
    function () {
        var Class = null;
        beforeAll(function (done) {
            require(['eoo'], function (oo) {
                Class = oo;
                done();
            });
        });

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
            it('Class.prototype.constructor should be a function', function () {
                expect(isType(Class.prototype.constructor, 'function')).toBe(true);
            });

            it('Class.prototype.$self should be Class', function () {
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
            beforeAll(function () {
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

            it('if called with an argument and the argument is an object,'
                + ' it should return a class has the properties and functions in the argument',
                function () {
                    var Sub = Class.create({
                            constructor: function () {
                                this.$super(arguments);
                            },
                            method: function () {
                                this.$super(arguments);
                                return 'method';
                            },
                            method1: function () {
                                return 'method1';
                            }
                        }
                    );

                    expect(isType(Sub, 'function')).toBe(true);
                    expect(function () {
                        new Sub();
                    }).not.toThrow();

                    var instance = new Sub();
                    expect(instance instanceof Class).toBe(true);
                    expect(instance.method).toThrow();
                    expect(instance.method1()).toEqual('method1');
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
                        constructor: function () {
                            this.$super(arguments);
                        },
                        superProp: 'subProp',
                        superMethod: function () {
                            var result = this.$super(arguments);
                            return result + ' ' + 'subMethod';
                        },
                        subMethod: function () {
                            this.$super(arguments);
                        }
                    });
                    var sub = new Sub();
                    expect(isType(Sub, 'function')).toBe(true);
                    expect(sub instanceof Super).toBe(true);
                    expect(sub.property).toEqual('property');
                    expect(sub.superMethod()).toEqual('superMethod subMethod');
                    expect(function () {
                        sub.subMethod();
                    }).toThrow();
                }
            );

            describe('inherits normal funciton', function () {
                var BaseClass;
                beforeEach(function () {
                    BaseClass = function () {
                        this.property = 'BaseClassProperty';
                    };
                    BaseClass.prototype = {
                        constructor: BaseClass,
                        protoProperty: 'protoProperty',
                        baseMethod1: function () {
                            return 'baseMethod1';
                        },
                        baseMethod2: function (arg) {
                            return arg;
                        }
                    };
                });

                it('Should return a class extends BaseClass, and the instance have BaseClass\'s method and property',
                    function () {
                        var Sub = Class.create(
                            BaseClass,
                            {
                                constructor: function () {
                                    this.$super(arguments);
                                },
                                baseMethod1: function () {
                                    return this.$super(arguments);
                                },
                                baseMethod2: function (arg) {
                                    return this.$super(arguments);
                                },
                                subMethod1: function () {
                                    return 'subMethod1';
                                },
                                subMethod2: function () {
                                    this.$super(arguments);
                                }

                            }
                        );

                        expect(isType(Sub, 'function')).toBe(true);
                        expect(Sub.$superClass).toEqual(BaseClass);

                        var instance = new Sub();
                        expect(instance.property).toEqual('BaseClassProperty');
                        expect(instance.baseMethod1()).toEqual('baseMethod1');
                        expect(instance.baseMethod2('hello')).toEqual('hello');
                        expect(instance.subMethod1()).toEqual('subMethod1');
                        expect(instance.protoProperty).toEqual('protoProperty');
                        expect(function () {
                            instance.subMethod2();
                        }).toThrow();
                    }
                );

            });

            describe('first argument is not a function', function () {
                it('if called with no arguments, it should return a class extends Class', function () {
                    var ClassTest = Class.create();
                    var instance = new ClassTest();
                    expect(isType(ClassTest, 'function')).toBe(true);
                    expect(instance instanceof Class).toBe(true);
                });

                it('if called with null as argument, should return a class extends Class', function () {
                    var ClassTest = Class.create(null);
                    var instance = new ClassTest();
                    expect(isType(ClassTest, 'function')).toBe(true);
                    expect(instance instanceof Class).toBe(true);
                });
            });
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

            it('If called with argument which instanceof Object is false, should throw error', function () {
                expect(function () {
                    Class.static('I am a string!');
                }).toThrow();
            });

            it('If called with argument typeof which is instance of Object, return a instance with argument as its prototype',
                function () {
                    var object = {
                        method: function () {
                            return 'I am a method!';
                        }
                    };

                    var fun = function () {};

                    var instance = Class.static(object);
                    var instanceFun = Class.static(fun);
                    expect(object.isPrototypeOf(instance)).toBe(true);
                    expect(fun.isPrototypeOf(instanceFun)).toBe(true);
                }
            );
        });

        describe('Class.toString', function () {
            it('Should return \"function Class() { [native code] }\"', function () {
                expect(Class.toString()).toEqual('function Class() { [native code] }');
            });
        });

        describe('Class.defineMembers', function () {
            var Super;
            var Sub;
            var Sub1;
            var superIns;
            var sub;
            var sub1;
            beforeAll(function () {
                Super = Class();
                Sub = Class(Super);
                Sub1 = Class(Sub);

                // 扩展Super接口
                Class.defineMembers(Super, {
                    superProp1: 'superProp1',
                    superProp2: 'superProp2',
                    method: function () {
                        return this.superProp1;
                    },
                    superMethod: function () {
                        return this.superProp2;
                    }
                });

                // 扩展Sub接口
                Class.defineMembers(Sub, {
                    // constructor 会在实例化时调用
                    constructor: function (prop) {
                        // $super 会自动调用父类的同名方法
                        this.$super(arguments);
                        this.subProp = prop;
                    },
                    method: function () {
                        return this.$super(arguments) + ', ' + this.subProp;
                    }
                });

                // 扩展Sub1接口
                Class.defineMembers(Sub1, {
                    constructor: function (prop1, prop2) {
                        this.$super(arguments);
                        this.sub1Prop = prop2;
                    },
                    method: function () {
                        return this.$super(arguments) + ', ' + this.sub1Prop;
                    }
                });
                superIns = new Super();
                sub = new Sub('Sub');
                sub1 = new Sub1('Sub', 'Sub1');
            });

            it('should return superProp1', function () {
                expect(superIns.method()).toEqual('superProp1');
            });
            it('should return superProp1, Sub', function () {
                expect(sub.method()).toEqual('superProp1, Sub');
            });
            it('should return superProp1, Sub, Sub1', function () {
                expect(sub1.method()).toEqual('superProp1, Sub, Sub1');
            });
            it('should return superProp2', function () {
                expect(superIns.superMethod()).toEqual('superProp2');
            });
            it('should return superProp2', function () {
                expect(sub.superMethod()).toEqual('superProp2');
            });
            it('should return superProp2', function () {
                expect(sub1.superMethod()).toEqual('superProp2');
            });
        });

    }
);

