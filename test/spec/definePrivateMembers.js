/**
 * @file private 特性测试用例
 * @author exodia(d_xinxin@163.com)
 */
describe('Class Private feature test: ', function () {
    function expectPrivateProperty(instance, property) {
        expect(function () {
            return instance[property];
        }).toThrow();

        expect(function () {
            instance[property] = 20;
        }).toThrow();
    }

    function expectPrivateMethod(instance, method) {
        expect(function () {
            instance[method]();
        }).toThrow();
        expectPrivateProperty(instance, method);
    }

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
                duplicatePrivateProp: 10,
                privateFromList: 10,
                privateInSuper: 20,
                privateFromListMethod: function () {
                    return 'privateFromListMethod';
                },
                $private: ['privateFromList', 'privateFromListMethod', 'privateInSuper',
                    'privateMethodInSuper', 'duplicatePrivateProp'],
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
                privateMethodInSuper: function () {
                    return '';
                }
            });
            oo.definePrivateMembers(Super, ['privateProp', 'privateMethod', 'duplicatePrivateProp']);

            Sub = oo(Super, {
                constructor: function Sub() {
                    this.$super(arguments);
                },
                privatePropOfSub: 'privatePropOfSub',
                privateMethodOfSub: function () {
                    return this.privatePropOfSub;
                },
                privateInSuper: 'privateInSuper',
                privateMethodInSuper: function () {
                    return this.privateMethodOfSub();
                },
                callAnothoerInstanceMethodSub: function (instance, method) {
                    return instance[method];
                },
                $private: ['privatePropOfSub', 'privateMethodOfSub']
            }, 'Sub');

            Sub1 = oo(Sub, {
                constructor: function Sub1() {},
                privatePropOfSub1: 'privatePropOfSub1',
                privateMethodOfSub: function () {
                    return this.privateMethod();
                },
                privateMethodOfSub1: function () {
                    return this.privatePropOfSub1;
                },
                privateMethod: function () {
                    return this.privateMethodOfSub1();
                },
                publicMethodOfSub1: function () {
                    return 'publicMethodOfSub1';
                },
                $private: ['privatePropOfSub1', 'privateMethodOfSub1', 'privateMethod']
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

        it('access private property from none class instance method should throw error', function () {
            expectPrivateProperty(sup, 'privateProp');
            expectPrivateProperty(sup, 'privateFromList');
            expectPrivateProperty(sup, 'duplicatePrivateProp');
            expectPrivateProperty(sup, 'privateMethodInSuper');

            expectPrivateMethod(sup, 'privateMethod');
            expectPrivateMethod(sup, 'privateFromListMethod');
            expectPrivateMethod(sup, 'privateMethodInSuper');
        });

        it('access private property from class instance method should allow', function () {
            expect(sup.getPrivateProp()).toBe(5);
            sup.updatePrivateProp(10);
            expect(sup.getPrivateProp()).toBe(10);
            expect(sup.callPrivateMethod()).toBe('privateMethod');
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

        it('access private property from none class instance method should throw error', function () {
            expectPrivateProperty(sub, 'privatePropOfSub');
            expectPrivateMethod(sub, 'privateMethodOfSub');
        });

        it('access a public property which is private in super class should allow', function () {
            expect(sub.privateMethodInSuper()).toBe('privatePropOfSub');
            expect(sub.privateInSuper).toBe('privateInSuper');
            expect(sub.duplicatePrivateProp).toBe(undefined);
            expect(sub.privateProp).toBe(undefined);
            expect(sub.privateMethod).toBe(undefined);
        });

        it('access a public method from super class should allow', function () {
            expect(sub.getPrivateProp()).toBe(undefined);
            sub.updatePrivateProp(10);
            expect(sub.getPrivateProp()).toBe(10);
        });

        it('access private property of another instance of the same class ' +
        'from current instance method should allow', function () {
            sub.updatePrivateProp(10);
            expect(sup.callAnotherInstanceMethod(sub, 'getPrivateProp')).toBe(10);
        });

        // TODO: to discuss
        it('access private property of another instance of the derived class ' +
        'from current instance method should allow', function () {
            //expect(sup.callAnotherInstanceMethod(sub, 'privateMethod')).toBe('privateMethod');
        });

        it('access private property of another instance of the derived class ' +
        'from super instance method should not allow', function () {
            expect(sup.callAnotherInstanceMethod.bind(sup, sub, 'privateMethodOfSub')).toThrow();
            expect(sup.callAnotherInstanceMethod.bind(sup, sub, 'privateMethodOfSub1')).toThrow();
        });

        it('access private property of another instance of the super class ' +
        'from derived instance method should allow', function () {
            expect(sub.callAnotherInstanceMethod(sup, 'privateMethod')).toBe('privateMethod');
            expect(sub.callAnotherInstanceMethod(sup, 'privateMethodInSuper')).toBe('');
        });

        it('access private property of another instance of the super class ' +
        'from none derived instance method should not allow', function () {
            expect(sub.callAnothoerInstanceMethodSub.bind(sub, sup, 'privateMethod')).toThrow();
            expect(sub.callAnothoerInstanceMethodSub.bind(sub, sup, 'privateMethodInSuper')).toThrow();
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
            expectPrivateProperty(sub, 'privatePropOfSub1');
            expectPrivateMethod(sub, 'privateMethodOfSub1');
            expectPrivateMethod(sub, 'privateMethod');
        });

        it('access a public property which is private in super class should allow', function () {
            expect(sub.privateMethodInSuper()).toBe('privatePropOfSub1');
            expect(sub.privateInSuper).toBe('privateInSuper');
            expect(sub.duplicatePrivateProp).toBe(undefined);
            expect(sub.privateProp).toBe(undefined);
            expect(sub.privatePropOfSub).toBe(undefined);
        });

        it('access a public method from super class should allow', function () {
            expect(sub.getPrivateProp()).toBe(undefined);
            sub.updatePrivateProp(10);
            expect(sub.getPrivateProp()).toBe(10);
        });

        it('access private property of another instance of the same class ' +
        'from current instance method should allow', function () {
            sub.updatePrivateProp(10);
            expect(sup.callAnotherInstanceMethod(sub, 'getPrivateProp')).toBe(10);
        });
    });
});