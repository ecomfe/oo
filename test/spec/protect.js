/**
 * @file protect 特性测试用例
 * @author exodia(d_xinxin@163.com)
 */
describe('Class Protect feature test: ', function () {
    function expectUndefined(instance, methods) {
        methods.forEach(function (method) {
            var value = instance[method];
            expect(value).toBe(undefined);
        });
    }

    var superProtectMethods = ['protectProp', 'protectFromList', 'duplicateProtectProp',
        'protectMethodInSuper', 'protectMethod', 'protectFromListMethod', 'protectMethodInSuper'];
    var subProtectMethods = ['protectPropOfSub', 'protectMethodOfSub'];

    var sub1ProtectMethods = ['protectPropOfSub1', 'protectMethodOfSub1', 'protectMethod'];

    var Super = null;
    var Sub = null;
    var Sub1 = null;
    beforeEach(function (done) {
        require(['eoo'], function (oo) {
            var $superProtect = oo.createPrivate({
                protectFromList: 20,

                protectMethod: function () {
                    return 'protectMethod';
                },
                protectFromListMethod: function () {
                    return 'protectFromListMethod';
                },
                protectMethodInSuper: function () {
                    return '';
                },
                duplicateProtectProp: 10
            });

            Super = oo({
                constructor: function Super() {
                    $superProtect(this).protectProp = 5;
                    $superProtect(this).protectInSuper = 20;
                },
                updateProtectProp: function (value) {
                    $superProtect(this).protectProp = value;
                },
                getProtectProp: function () {
                    return $superProtect(this).protectProp;
                },
                callProtectMethod: function () {
                    return $superProtect(this).protectMethod.call(this);
                },
                callAnotherInstanceProtectMethod: function (ins, method) {
                    return $superProtect(ins)[method].call(ins);
                },
                getAnotherInstanceProtectProperty: function (ins, property) {
                    return $superProtect(ins)[property];
                },
                $protect: $superProtect
            });


            var $subProtect = oo.createPrivate({
                protectPropOfSub: 'protectPropOfSub',
                protectMethodOfSub: function () {
                    return $subProtect(this).protectPropOfSub;
                },
                getProtectProp: function (prop) {
                    return $subProtect(this)[prop];
                },
                // override
                duplicateProtectProp: 30,
                protectMethodInSuper: function () {
                    return 'override protectMethodInSuper';
                }
            });
            Sub = oo(Super, {
                constructor: function Sub() {
                    this.$super(arguments);
                },
                protectInSuper: 'protectInSuper',
                protectMethodInSuper: function () {
                    return $subProtect(this).protectMethodOfSub.call(this);
                },
                callAnotherInstanceProtectMethodSub: function (instance, method) {
                    return $subProtect(instance)[method].call(instance);
                },
                getAnotherInstanceProtectPropertyOfSub: function (ins, property) {
                    return $subProtect(ins)[property];
                },
                callProtectMethod: function (method) {
                    return $subProtect(this)[method].apply(this, [].slice.call(arguments, 1));
                },
                $protect: $subProtect
            });


            var $sub1Protect = oo.createPrivate({
                protectMethodOfSub1: function () {
                    return $sub1Protect(this).protectPropOfSub1;
                },
                // override
                protectMethod: function () {
                    return $sub1Protect(this).protectMethodOfSub1.call(this);
                }
            });
            Sub1 = oo(Sub, {
                constructor: function Sub1() {
                    this.$super(arguments);
                    $sub1Protect(this).protectPropOfSub1 = 'protectPropOfSub1';
                },
                callProtectMethodOfSub1: function () {
                    return $sub1Protect(this).protectMethod.call(this);
                },
                getAnotherInstanceProtectPropertyOfSub1: function (ins, property) {
                    return $sub1Protect(ins)[property];
                },
                callParentProtectMethod: function (method) {
                    return $sub1Protect(this)[method].apply(this, [].slice.call(arguments, 1));
                },
                $protect: $sub1Protect
            });

            done();
        });
    });

    describe('Super base protect test: ', function () {
        var sup = null;
        var anotherSup = null;
        beforeEach(function () {
            sup = new Super();
            anotherSup = new Super();
        });

        it('access protect property from none class instance method should return undefined', function () {
            expectUndefined(sup, superProtectMethods);
        });

        it('assign protect property from none class instance method should allow, ' +
            'but do not influence the inside protect value', function () {
            var outside = {};
            sup.protectProp = outside;
            expect(sup.protectProp).toBe(outside);
            expect(sup.getProtectProp()).toBe(5);
            sup.updateProtectProp(10);
            expect(sup.getProtectProp()).toBe(10);

            sup.protectMethod = outside;
            expect(sup.protectMethod).toBe(outside);
            expect(sup.callProtectMethod()).toBe('protectMethod');
        });

        it('access protect property from class instance method should allow', function () {
            expect(sup.getProtectProp()).toBe(5);
            sup.updateProtectProp(10);
            expect(sup.getProtectProp()).toBe(10);
            expect(sup.callProtectMethod()).toBe('protectMethod');
            expectUndefined(sup, superProtectMethods);
        });

        it('access protect property of another instance of the same class ' +
            'from current instance method should allow', function () {
            expect(sup.getProtectProp()).toBe(anotherSup.getProtectProp());
            expect(sup.callAnotherInstanceProtectMethod(anotherSup, 'protectMethod')).toBe('protectMethod');
        });
    });

    describe('Inheritance protect test: ', function () {
        var sub = null;
        var anotherSub = null;
        var sup = null;
        beforeEach(function () {
            sup = new Super();
            sub = new Sub();
            anotherSub = new Sub();
        });

        it('access protect property from none class instance method should return undefined', function () {
            expectUndefined(sub, subProtectMethods);
        });

        it('access a public property which is protect in super class should allow', function () {
            expect(sub.protectMethodInSuper()).toBe('protectPropOfSub');
            expect(sub.protectInSuper).toBe('protectInSuper');
            expect(sub.duplicateProtectProp).toBe(undefined);
            expect(sub.protectProp).toBe(undefined);
            expect(sub.protectMethod).toBe(undefined);
            expectUndefined(sub, subProtectMethods);
        });

        it('access a public method from super class should allow', function () {
            expect(sub.getProtectProp()).toBe(5);
            sub.updateProtectProp(10);
            expect(sub.getProtectProp()).toBe(10);
            expect(sub.protectProp).toBe(undefined);
        });

        it('access protect property of another instance of the same class ' +
            'from public method should allow', function () {
            expect(sub.callAnotherInstanceProtectMethodSub(anotherSub, 'protectMethodOfSub')).toBe('protectPropOfSub');
        });

        it('access protect property of another instance of the derived class ' +
            'from current instance method should allow', function () {
            expect(sup.callAnotherInstanceProtectMethod(sub, 'protectMethod')).toBe('protectMethod');
            expect(sup.callAnotherInstanceProtectMethod(sub, 'protectMethodInSuper')).toBe('');
        });

        it('access protect property of another instance of the derived class ' +
            'from super instance method should be undefined', function () {
            expect(sup.getAnotherInstanceProtectProperty(sub, 'protectMethodOfSub')).toBe(undefined);
            expect(sup.getAnotherInstanceProtectProperty(sub, 'protectMethodOfSub1')).toBe(undefined);
        });

        it('access protect property of another instance of the super class ' +
            'from derived instance public method should allow', function () {
            expect(sub.callAnotherInstanceProtectMethod(sup, 'protectMethod')).toBe('protectMethod');
            expect(sub.callAnotherInstanceProtectMethod(sup, 'protectMethodInSuper')).toBe('');
        });

        it('access protect property of another instance of the super class ' +
            'from protect token of the derived class should allow', function () {
            expect(sub.getAnotherInstanceProtectPropertyOfSub(sup, 'protectMethod')).toBe('protectMethod');
            expect(sub.getAnotherInstanceProtectPropertyOfSub(sup, 'protectMethodInSuper')).toBe('');
        });

        it('protect property should ben inherited and could be access from sub class', function () {
            var sub = new Sub();
            expected(sub.callProtectMethod('getProtectProp', 'protectFromList')).toBe(20);
            expected(sub.callProtectMethod('getProtectProp', 'protectProp')).toBe(5);
            expected(sub.callProtectMethod('getProtectProp', 'protectInSuper')).toBe(20);
            expected(sub.callProtectMethod('getProtectProp', 'protectFromListMethod')).toBe('protectFromListMethod');
            expected(sub.callProtectMethod('getProtectProp', 'protectMethod')).toBe('protectMethod');

            // override
            expected(sub.callProtectMethod('getProtectProp', 'duplicateProtectProp')).toBe(30);
            expected(sub.callProtectMethod('getProtectProp', 'protectMethodInSuper')).toBe('override protectMethodInSuper');

        });

    });

    describe('Deep inheritance protect test: ', function () {
        var sup = null;
        var sub = null;
        var anotherSub = null;
        beforeEach(function () {
            sup = new Super();
            sub = new Sub1();
            anotherSub = new Sub1();
        });

        it('access protect property from none class instance method should return undefined', function () {
            expectUndefined(sub, sub1ProtectMethods);
        });

        it('access protect member from public method should allow', function () {
            expect(sub.callProtectMethodOfSub1()).toBe('protectPropOfSub1');
        });

        it('access a public property which is protect in super class should allow', function () {
            expect(sub.protectMethodInSuper()).toBe('protectPropOfSub');
            expect(sub.protectInSuper).toBe('protectInSuper');
            expect(sub.duplicateProtectProp).toBe(undefined);
            expect(sub.protectProp).toBe(undefined);
            expect(sub.protectPropOfSub).toBe(undefined);
        });

        it('access a public method from super class should allow', function () {
            expect(sub.getProtectProp()).toBe(5);
            sub.updateProtectProp(10);
            expect(sub.getProtectProp()).toBe(10);
            expectUndefined(sub, sub1ProtectMethods);
        });

        it('access protect member of another instance of the super class ' +
            'from derived instance method should allow', function () {
            expect(sub.callAnotherInstanceProtectMethod(anotherSub, 'protectMethod')).toBe('protectMethod');
            expect(sub.callAnotherInstanceProtectMethod(sup, 'protectMethodInSuper')).toBe('');
            expect(sub.getAnotherInstanceProtectPropertyOfSub1(anotherSub, 'protectPropOfSub1'))
                .toBe('protectPropOfSub1');
        });

        it('access inherited protect member from inherited public method', function () {

            // from Super
            expected(sub.callProtectMethod('getProtectProp', 'protectFromList')).toBe(20);
            expected(sub.callProtectMethod('getProtectProp', 'protectProp')).toBe(5);
            expected(sub.callProtectMethod('getProtectProp', 'protectInSuper')).toBe(20);
            expected(sub.callProtectMethod('getProtectProp', 'protectFromListMethod')).toBe('protectFromListMethod');
            expected(sub.callProtectMethod('getProtectProp', 'protectMethod')).toBe('protectMethod');

            // from Sub
            expected(sub.callProtectMethod('getProtectProp', 'duplicateProtectProp')).toBe(30);
            expected(sub.callProtectMethod('getProtectProp', 'protectMethodInSuper'))
                .toBe('override protectMethodInSuper');
        });

        it('access inherited protect member from derived method', function () {
            // from Sub1
            expected(sub.callProtectMethodOfSub1()).toBe('protectPropOfSub1');

            // from Sub
            expected(sub.callParentProtectMethod('getProtectProp', 'duplicateProtectProp')).toBe(30);
            expected(sub.callParentProtectMethod('getProtectProp', 'protectMethodInSuper'))
                .toBe('override protectMethodInSuper');

            // from Super
            expected(sub.callParentProtectMethod('getProtectProp', 'protectFromList')).toBe(20);
            expected(sub.callParentProtectMethod('getProtectProp', 'protectProp')).toBe(5);
            expected(sub.callParentProtectMethod('getProtectProp', 'protectInSuper')).toBe(20);
            expected(sub.callParentProtectMethod('getProtectProp', 'protectFromListMethod'))
                .toBe('protectFromListMethod');

            // override
            expected(sub.callParentProtectMethod('getProtectProp', 'protectMethod')).toBe('protectPropOfSub1');
        });

    });
});