/**
 * @file private 特性
 * @author exodia(d_xinxin@163.com)
 */
void function (define, undefined) {
    define(
        function (require) {
            var constTable = require('./const');
            var OWNER = constTable.OWNER;
            var INTERNAL_MEMBER = constTable.INTERNAL_MEMBER;
            var META = constTable.META;
            var PREFIX = constTable.ATTRIBUTE_PREFIX;
            var ERR_NON_FUNCTION_CLASS = 'Class must be a function: ';
            var ERR_NON_LIST_MEMBERS = 'privateMembers must be a list: ';

            function definePrivateMembers(Class, privateMembers) {
                if (typeof Class !== 'function') {
                    throw new TypeError(ERR_NON_FUNCTION_CLASS + Class);
                }

                if (!privateMembers) {
                    throw new TypeError(ERR_NON_LIST_MEMBERS + privateMembers);
                }

                var privateList = Class[META].privateMember;

                for (var i = privateMembers.length - 1; i > -1; --i) {
                    var property = privateMembers[i];
                    if (!privateList[property]) {
                        createPrivateAccessor(Class, privateMembers[i]);
                        privateList[property] = true;
                    }
                }
            }

            function createPrivateAccessor(Class, property) {
                var descriptor = Object.getOwnPropertyDescriptor(Class.prototype, property) || {
                        configurable: true,
                        enumerable: true,
                        writable: true
                    };

                var oldGet = descriptor.get;
                var oldSet = descriptor.set;
                var writable = descriptor.writable;
                var privateKey = getPrivateKey(Class, property);

                var get = function () {
                    var caller = arguments.callee.caller;
                    if (caller && caller[OWNER]) {
                        // 有 caller 和 owner，找到私有key
                        return oldGet ? oldGet.call(this) : this[getPrivateKey(caller[OWNER], property)];
                    }

                    // 外部调用且不是私有的，说明子类该属性为public
                    if (!isPrivate(this.$self, property)) {
                        return this[PREFIX + property];
                        //return this[getPrivateKey(this.$self, property)];
                    }

                    // 外部调用，且为私有，走实例化的存储区域
                    return (this[INTERNAL_MEMBER] || {})[property];
                };

                var set = function (value) {
                    var caller = arguments.callee.caller;
                    if (caller && caller[OWNER]) {
                        oldSet ? oldSet.call(this, value) : this[getPrivateKey(caller[OWNER], property)] = value;
                        return;
                    }

                    // 外部调用且不是私有的，说明子类该属性为public，挂在同一个 key 上
                    if (!isPrivate(this.$self, property) && writable) {
                        //this[getPrivateKey(this.$self, property)] = value;
                        this[PREFIX + property] = value;
                        return;
                    }

                    // 外部调用，且为私有，走实例化的存储区域
                    if (writable) {
                        this[INTERNAL_MEMBER] = this[INTERNAL_MEMBER] || {};
                        this[INTERNAL_MEMBER][property] = value;
                    }
                };

                descriptor.get = get;
                descriptor.set = set;
                delete descriptor.writable;

                if ('value' in descriptor) {
                    var value = descriptor.value;
                    delete descriptor.value;
                    Object.defineProperty(Class.prototype, property, descriptor);
                    Class.prototype[privateKey] = value;
                }
                else {
                    Object.defineProperty(Class.prototype, property, descriptor);
                }
            }

            function getPrivateKey(Class, property) {
                return property + '@Class_' + Class[META].uuid;
            }

            function isPrivate(Class, property) {
                return Class ? Class[META].privateMember[property] : false;
            }

            return typeof Object.defineProperty === 'function' ? definePrivateMembers : function () {};
        }
    );
}(typeof define === 'function' && define.amd ? define :
        function (factory) {
            module.exports = factory(require);
        }
);