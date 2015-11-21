/**
 * @file private 特性测试用例
 * @author exodia(d_xinxin@163.com)
 */
describe('Class Private feature test: ', function () {
    function expectUndefined(instance, methods) {
        methods.forEach(function (method) {
            var value = instance[method];
            expect(value).toBe(undefined);
        });
    }

    var superPrivateMethods = ['privateProp', 'privateFromList', 'duplicatePrivateProp',
        'privateMethodInSuper', 'privateMethod', 'privateFromListMethod', 'privateMethodInSuper'];
    var subPrivateMethods = ['privatePropOfSub', 'privateMethodOfSub'];

    var sub1PrivateMethods = ['privatePropOfSub1', 'privateMethodOfSub1', 'privateMethod'];

    var Super = null;
    var Sub = null;
    var Sub1 = null;
    beforeEach(function (done) {
        require(['eoo'], function (oo) {
            var $superPrivate = oo.createPrivate({
                privateFromList: 20,

                privateMethod: function () {
                    return 'privateMethod';
                },
                privateFromListMethod: function () {
                    return 'privateFromListMethod';
                },
                privateMethodInSuper: function () {
                    return '';
                },
                duplicatePrivateProp: 10
            });

            Super = oo({
                constructor: function Super() {
                    $superPrivate(this).privateProp = 5;
                    $superPrivate(this).privateInSuper = 20;
                },
                updatePrivateProp: function (value) {
                    $superPrivate(this).privateProp = value;
                },
                getPrivateProp: function () {
                    return $superPrivate(this).privateProp;
                },
                callPrivateMethod: function () {
                    return $superPrivate(this).privateMethod.call(this);
                },
                callAnotherInstancePrivateMethod: function (ins, method) {
                    return $superPrivate(ins)[method].call(ins);
                },
                getAnotherInstancePrivateProperty: function (ins, property) {
                    return $superPrivate(ins)[property];
                }
            });


            var $subPrivate = oo.createPrivate({
                privatePropOfSub: 'privatePropOfSub',
                privateMethodOfSub: function () {
                    return $subPrivate(this).privatePropOfSub;
                }
            });
            Sub = oo(Super, {
                constructor: function Sub() {
                    this.$super(arguments);
                },
                privateInSuper: 'privateInSuper',
                privateMethodInSuper: function () {
                    return $subPrivate(this).privateMethodOfSub.call(this);
                },
                callAnotherInstancePrivateMethodSub: function (instance, method) {
                    return $subPrivate(instance)[method].call(instance);
                },
                getAnotherInstancePrivatePropertyOfSub: function (ins, property) {
                    return $subPrivate(ins)[property];
                }
            });


            var $sub1Private = oo.createPrivate({
                privateMethodOfSub1: function () {
                    return $sub1Private(this).privatePropOfSub1;
                },
                privateMethod: function () {
                    return $sub1Private(this).privateMethodOfSub1.call(this);
                }
            });
            Sub1 = oo(Sub, {
                constructor: function Sub1() {
                    this.$super(arguments);
                    $sub1Private(this).privatePropOfSub1 = 'privatePropOfSub1';
                },
                callPrivateMethodOfSub1: function () {
                    return $sub1Private(this).privateMethod.call(this);
                },
                getAnotherInstancePrivatePropertyOfSub1: function (ins, property) {
                    return $sub1Private(ins)[property];
                }
            });

            done();
        });
    });

    describe('Super base private test: ', function () {
        var sup = null;
        var anotherSup = null;
        beforeEach(function () {
            sup = new Super();
            anotherSup = new Super();
        });

        it('access private property from none class instance method should return undefined', function () {
            expectUndefined(sup, superPrivateMethods);
        });

        it('assign private property from none class instance method should allow, ' +
        'but do not influence the inside private value', function () {
            var outside = {};
            sup.privateProp = outside;
            expect(sup.privateProp).toBe(outside);
            expect(sup.getPrivateProp()).toBe(5);
            sup.updatePrivateProp(10);
            expect(sup.getPrivateProp()).toBe(10);

            sup.privateMethod = outside;
            expect(sup.privateMethod).toBe(outside);
            expect(sup.callPrivateMethod()).toBe('privateMethod');
        });

        it('access private property from class instance method should allow', function () {
            expect(sup.getPrivateProp()).toBe(5);
            sup.updatePrivateProp(10);
            expect(sup.getPrivateProp()).toBe(10);
            expect(sup.callPrivateMethod()).toBe('privateMethod');
            expectUndefined(sup, superPrivateMethods);
        });

        it('access private property of another instance of the same class ' +
        'from current instance method should allow', function () {
            expect(sup.getPrivateProp()).toBe(anotherSup.getPrivateProp());
            expect(sup.callAnotherInstancePrivateMethod(anotherSup, 'privateMethod')).toBe('privateMethod');
        });
    });

    describe('Inheritance private test: ', function () {
        var sub = null;
        var anotherSub = null;
        var sup = null;
        beforeEach(function () {
            sup = new Super();
            sub = new Sub();
            anotherSub = new Sub();
        });

        it('access private property from none class instance method should return undefined', function () {
            expectUndefined(sub, subPrivateMethods);
        });

        it('access a public property which is private in super class should allow', function () {
            expect(sub.privateMethodInSuper()).toBe('privatePropOfSub');
            expect(sub.privateInSuper).toBe('privateInSuper');
            expect(sub.duplicatePrivateProp).toBe(undefined);
            expect(sub.privateProp).toBe(undefined);
            expect(sub.privateMethod).toBe(undefined);
            expectUndefined(sub, subPrivateMethods);
        });

        it('access a public method from super class should allow', function () {
            expect(sub.getPrivateProp()).toBe(5);
            sub.updatePrivateProp(10);
            expect(sub.getPrivateProp()).toBe(10);
            expect(sub.privateProp).toBe(undefined);
        });

        it('access private property of another instance of the same class ' +
        'from public method should allow', function () {
            expect(sub.callAnotherInstancePrivateMethodSub(anotherSub, 'privateMethodOfSub')).toBe('privatePropOfSub');
        });

        it('access private property of another instance of the derived class ' +
        'from current instance method should allow', function () {
            expect(sup.callAnotherInstancePrivateMethod(sub, 'privateMethod')).toBe('privateMethod');
            expect(sup.callAnotherInstancePrivateMethod(sub, 'privateMethodInSuper')).toBe('');
        });

        it('access private property of another instance of the derived class ' +
        'from super instance method should be undefined', function () {
            expect(sup.getAnotherInstancePrivateProperty(sub, 'privateMethodOfSub')).toBe(undefined);
            expect(sup.getAnotherInstancePrivateProperty(sub, 'privateMethodOfSub1')).toBe(undefined);
        });

        it('access private property of another instance of the super class ' +
        'from derived instance method should allow', function () {
            expect(sub.callAnotherInstancePrivateMethod(sup, 'privateMethod')).toBe('privateMethod');
            expect(sub.callAnotherInstancePrivateMethod(sup, 'privateMethodInSuper')).toBe('');
        });

        it('access private property of another instance of the super class ' +
        'from none derived instance method should return undefined', function () {
            expect(sub.getAnotherInstancePrivatePropertyOfSub(sup, 'privateMethod')).toBe(undefined);
            expect(sub.getAnotherInstancePrivatePropertyOfSub(sup, 'privateMethodInSuper')).toBe(undefined);
        });
    });

    describe('Deep inheritance private test: ', function () {
        var sup = null;
        var sub = null;
        var anotherSub = null;
        beforeEach(function () {
            sup = new Super();
            sub = new Sub1();
            anotherSub = new Sub1();
        });

        it('access private property from none class instance method should return undefined', function () {
            expectUndefined(sub, sub1PrivateMethods);
        });

        it('access private member from public method should allow', function () {
            expect(sub.callPrivateMethodOfSub1()).toBe('privatePropOfSub1');
        });

        it('access a public property which is private in super class should allow', function () {
            expect(sub.privateMethodInSuper()).toBe('privatePropOfSub');
            expect(sub.privateInSuper).toBe('privateInSuper');
            expect(sub.duplicatePrivateProp).toBe(undefined);
            expect(sub.privateProp).toBe(undefined);
            expect(sub.privatePropOfSub).toBe(undefined);
        });

        it('access a public method from super class should allow', function () {
            expect(sub.getPrivateProp()).toBe(5);
            sub.updatePrivateProp(10);
            expect(sub.getPrivateProp()).toBe(10);
            expectUndefined(sub, sub1PrivateMethods);
        });

        it('access private property of another instance of the super class ' +
        'from derived instance method should allow', function () {
            expect(sub.callAnotherInstancePrivateMethod(anotherSub, 'privateMethod')).toBe('privateMethod');
            expect(sub.callAnotherInstancePrivateMethod(sup, 'privateMethodInSuper')).toBe('');
            expect(sub.getAnotherInstancePrivatePropertyOfSub1(anotherSub, 'privatePropOfSub1'))
                .toBe('privatePropOfSub1');
        });
    });
});