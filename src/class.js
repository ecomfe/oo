/**
 * @file class 提供 Class 基础支持
 * @author exodia(d_xinxin@163.com)
 */
void function (define) {
    define(
        function (require) {
            var Empty = function () { };
            var constTable = require('./const');
            var NAME = constTable.NAME;
            var OWNER = constTable.OWNER;
            var PRIVATE_KEY = constTable.PRIVATE_KEY;
            var META = constTable.META;
            var u = require('./util');
            var uuid = 0;

            /**
             * 简单的 js oo 库
             *
             * 用法:
             *      @example
             *      // 来个简单的基类，最简单的是 var Super = Class();
             *      var Super = Class({
         *          superProp1: 'superProp1',
         *          superProp2: 'superProp2',
         *          method: function(){
         *              alert(this.superProp1);
         *          },
         *          superMethod2: function(){
         *              alert(this.superProp2);
         *          }
         *      })
             *
             *      // 来个派生类，继承 Super
             *      var Sub = Class(Super, {
         *          // constructor 会在实例化时调用
         *          constructor: function(prop){
         *             // $super 会自动调用父类的同名方法
         *             this.$super(arguments)
         *             this.subProp = prop
         *             alert("Sub init")
         *          },
         *          method: function(){
         *              this.$super(arguments);
         *              alert(this.subProp);
         *          }
         *      })
             *
             *      var Sub1 = Class(Sub, {
         *          constructor: function(prop1, prop2){
         *             this.$super(arguments)
         *             this.sub1Prop = prop2;
         *             alert("Sub1 init")
         *          },
         *          method: function(){
         *              this.$super(arguments)
         *              alert(this.sub1Prop)
         *          }
         *      })
             *
             *      var superIns = new Super();
             *      var sub = new Sub('Sub'); // alert: Sub init
             *      var sub1 = new Sub1('Sub', 'Sub1') // alert: Sub init, Sub1 init
             *      superIns.method() // alert: superProp1
             *      sub.method() // alert: superProp1, Sub
             *      sub1.method() // alert: superProp1, Sub, Sub1
             *      sub.superMethod() // alert: superProp2
             *      sub1.superMethod() // alert: superProp2
             *
             */

            /**
             * Class构造函数
             *
             * @class Class
             * @constructor
             * @param {Function | Object} [BaseClass] 基类
             * @param {Object} [overrides] 重写基类属性的对象
             * @return {Function}
             */
            function Class() {
                return Class.create.apply(Class, arguments);
            }

            /**
             * 创建基类的继承类
             *
             * 3种重载方式
             *
             * - '.create()'
             * - '.create(overrides)'
             * - '.create(BaseClass, overrides)'
             *
             * @static
             * @param {Function | Object} [BaseClass] 基类
             * @param {Object} [overrides] 重写基类属性的对象
             * @param {string} [name] 类名
             * @return {Function}
             */
            Class.create = function (BaseClass, overrides, name) {
                overrides = overrides || {};
                BaseClass = BaseClass || Class;
                if (typeof BaseClass === 'object') {
                    overrides = BaseClass;
                    BaseClass = Class;
                }

                var kclass = inherit(BaseClass);
                kclass.toString = toString;
                var meta = kclass[META] = {protoMember: {}, privateMember: {}, name: name, uuid: ++uuid};

                var assigner = getAssigner(kclass);
                u.eachObject(
                    overrides,
                    function (value, key) {
                        if (key !== PRIVATE_KEY) {
                            assigner(value, key);
                            meta.protoMember[key] = true;
                        }
                    }
                );

                var privateList = [];
                u.eachObject(
                    overrides[PRIVATE_KEY] || {},
                    function (value, key) {
                        assigner(value, key);
                        privateList.push(key);
                    }
                );

                Class.definePrivateMembers(kclass, privateList);

                return kclass;
            };

            /**
             *
             * @type {Function} creates a new object with the specified prototype object and properties.
             *  Just equals `Object.create` method.
             * @param proto {Object} The object which should be the prototype of the newly-created object.
             * @return {Object}
             */
            Class.static = typeof Object.create === 'function' ? Object.create : createStatic;

            function createStatic(o) {
                if (arguments.length > 1) {
                    throw new Error('Second argument not supported');
                }
                if (!(o instanceof Object)) {
                    throw new TypeError('Argument must be an object');
                }
                Empty.prototype = o;
                return new Empty();
            }

            /**
             * 创建类的方法
             *
             * @param {Function} BaseClass 类构造函数
             * @param {Object} [members] 类属性的对象
             */
            Class.defineMembers = function (BaseClass, members) {
                members = members || {};
                if (typeof BaseClass !== 'function') {
                    throw new TypeError('First argument must be a function');
                }

                u.eachObject(members, getAssigner(BaseClass));
            };

            Class.definePrivateMembers = require('./definePrivateMembers');

            /**
             * 统一 toString 执行结果
             *
             * @static
             * @return {string}
             */
            Class.toString = function () {
                return 'function Class() { [native code] }';
            };

            Class[META] = {protoMember: {}, privateMember: {}, name: 'EooClass'};

            Class.prototype = {
                constructor: function () {},
                $self: Class,
                $superClass: Object,
                $super: function (args) {
                    var method = this.$super.caller;
                    var name = method[NAME];
                    var superClass = method[OWNER].$superClass;
                    var superMethod = superClass.prototype[name];

                    if (typeof superMethod !== 'function') {
                        throw new TypeError('Call the super class\'s ' + name + ', but it is not a function!');
                    }

                    return superMethod.apply(this, args);
                }
            };

            /**
             * 返回基类的一个继承对象
             *
             * @ignore
             * @param {Function} BaseClass 基类
             * @return {Function}
             */
            function inherit(BaseClass) {
                var kclass = function () {
                    // 若未进行 constructor 的重写，则klass.prototype.constructor指向BaseClass.prototype.constructor
                    return kclass.prototype.constructor.apply(this, arguments);
                };

                Empty.prototype = BaseClass.prototype;

                var proto = kclass.prototype = new Empty();
                proto.$self = kclass;
                if (!('$super' in proto)) {
                    proto.$super = Class.prototype.$super;
                }

                kclass.$superClass = BaseClass;

                return kclass;
            }

            /**
             * toString method
             *
             * @ignore
             * @return {string}
             */
            function toString() {
                return this.prototype.constructor.toString();
            }

            function getAssigner(Class) {
                return function (value, key) {
                    if (typeof value === 'function') {
                        value[NAME] = key;
                        value[OWNER] = Class;
                    }
                    Class.prototype[key] = value;
                };
            }

            return Class;
        });
}(typeof define === 'function' && define.amd ? define :
        function (factory) {
            module.exports = factory(require);
        }
);
