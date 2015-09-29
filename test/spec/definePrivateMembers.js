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
            Super = oo({
                constructor: function Super() {},
                privateProp: 5,
                privateMethod: function () {
                    return 'privateMethod';
                },
                $private: {
                    privateFromList: 20,
                    privateInSuper: 20,
                    privateFromListMethod: function () {
                        return 'privateFromListMethod';
                    },
                    privateMethodInSuper: function () {
                        return '';
                    },
                    duplicatePrivateProp: 10
                },
                updatePrivateProp: function (value) {
                    this.privateProp = value;
                },
                getPrivateProp: function () {
                    return this.privateProp;
                },
                callPrivateMethod: function () {
                    return this.privateMethod();
                },
                callAnotherInstanceMethod: function (ins, method) {
                    return ins[method]();
                },
                getAnotherInstanceProperty: function (ins, property) {
                    return ins[property];
                }
            });
            oo.definePrivateMembers(Super, ['privateProp', 'privateMethod', 'duplicatePrivateProp']);

            Sub = oo(Super, {
                constructor: function Sub() {
                    this.$super(arguments);
                },

                privateInSuper: 'privateInSuper',
                privateMethodInSuper: function () {
                    return this.privateMethodOfSub();
                },
                callAnothoerInstanceMethodSub: function (instance, method) {
                    return instance[method];
                },
                getAnotherInstanceProperty: function (ins, property) {
                    return ins[property];
                },
                $private: {
                    privatePropOfSub: 'privatePropOfSub',
                    privateMethodOfSub: function () {
                        return this.privatePropOfSub;
                    }
                }
            }, 'Sub');

            Sub1 = oo(Sub, {
                constructor: function Sub1() {},
                privateMethodOfSub: function () {
                    return this.privateMethod();
                },
                publicMethodOfSub1: function () {
                    return 'publicMethodOfSub1';
                },
                getAnotherInstanceProperty: function (ins, property) {
                    return ins[property];
                },
                $private: {
                    privatePropOfSub1: 'privatePropOfSub1',
                    privateMethodOfSub1: function () {
                        return this.privatePropOfSub1;
                    },
                    privateMethod: function () {
                        return this.privateMethodOfSub1();
                    }
                }
            }, 'Sub1');

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
            expect(sup.callAnotherInstanceMethod(anotherSup, 'getPrivateProp')).toBe(5);
            expect(sup.callAnotherInstanceMethod(anotherSup, 'privateMethod')).toBe('privateMethod');
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
        'from current instance method should allow', function () {
            sub.updatePrivateProp(10);
            expect(sup.callAnotherInstanceMethod(sub, 'getPrivateProp')).toBe(10);
        });

        it('access private property of another instance of the derived class ' +
        'from current instance method should allow', function () {
            expect(sup.callAnotherInstanceMethod(sub, 'privateMethod')).toBe('privateMethod');
            expect(sup.callAnotherInstanceMethod(sub, 'privateMethodInSuper')).toBe('');
        });

        it('access private property of another instance of the derived class ' +
        'from super instance method should not allow', function () {
            expect(sup.getAnotherInstanceProperty(sub, 'privateMethodOfSub')).toBe(undefined);
            expect(sup.getAnotherInstanceProperty(sub, 'privateMethodOfSub1')).toBe(undefined);
        });

        it('access private property of another instance of the super class ' +
        'from derived instance method should allow', function () {
            expect(sub.callAnotherInstanceMethod(sup, 'privateMethod')).toBe('privateMethod');
            expect(sub.callAnotherInstanceMethod(sup, 'privateMethodInSuper')).toBe('');
        });

        it('access private property of another instance of the super class ' +
        'from none derived instance method should return undefined', function () {
            expect(sub.getAnotherInstanceProperty(sup, 'privateMethod')).toBe(undefined);
            expect(sub.getAnotherInstanceProperty(sup, 'privateMethodInSuper')).toBe(undefined);
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

        it('access private property from none class instance method should throw error', function () {
            expectUndefined(sub, sub1PrivateMethods);
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

        it('access private property of another instance of the same class ' +
        'from current instance method should allow', function () {
            sub.updatePrivateProp(10);
            expect(sup.callAnotherInstanceMethod(sub, 'getPrivateProp')).toBe(10);
        });
    });
});