/**
 * @file private 特性
 * @author exodia(d_xinxin@163.com)
 */
void function (define, undefined) {
    define(
        function (require) {
            var constTable = require('./const');
            var u = require('./util');
            var OWNER = constTable.OWNER;
            var INTERNAL_MEMBER = constTable.INTERNAL_MEMBER;
            var EMPTY_DESCRIPTOR = constTable.EMPTY_DESCRIPTOR;
            var META = constTable.META;
            var ERR_NON_FUNCTION_CLASS = 'Class must be a function: ';
            var ERR_NON_LIST_MEMBERS = 'privateMembers must be a list: ';
            var ERR_ILLEGAL_CALL = ' is private, can not access from outside method';


            function definePrivateMembers(Class, privateMembers) {
                if (typeof Class !== 'function') {
                    throw new TypeError(ERR_NON_FUNCTION_CLASS + Class);
                }

                if (!privateMembers) {
                    throw new TypeError(ERR_NON_LIST_MEMBERS + privateMembers);
                }

                var privateList = Class[META].privateMember;

                for (var i = privateMembers.length - 1; i > -1; --i) {
                    if (u.indexOf(privateList) === -1) {
                        createPrivateAccessor(Class, privateMembers[i]);
                        privateList.push(privateMembers[i]);
                    }
                }

                // 找到父类私有成员，如果子类未定义该成员，则设置未 undefined，这会带来 in 操作符的检测副作用
                var Super = Class.$superClass;
                if (Super) {
                    var proto = Class.prototype;
                    var protoMember = Class[META].protoMember;
                    var superPrivateList = (Super[META] || {}).privateMember || [];
                    for (i = superPrivateList.length - 1; i > -1; --i) {
                        var property = superPrivateList[i];
                        if (!protoMember.hasOwnProperty(property)) {
                            Object.defineProperty(proto, property, EMPTY_DESCRIPTOR);
                        }
                    }
                }
            }

            function createPrivateAccessor(Class, property) {
                var descriptor = Object.getOwnPropertyDescriptor(Class.prototype, property) || {
                        configurable: true,
                        enumerable: true
                    };

                var oldGet = descriptor.get;
                var oldSet = descriptor.set;
                var value = descriptor.value;
                var writable = descriptor.writable;

                var get = function () {
                    validateCaller(arguments.callee.caller, Class, this, property);

                    if (oldGet) {
                        return oldGet.call(this);
                    }

                    this[INTERNAL_MEMBER] = this[INTERNAL_MEMBER] || {};

                    if (!(property in this[INTERNAL_MEMBER])) {
                        this[INTERNAL_MEMBER][property] = value;
                    }

                    return this[INTERNAL_MEMBER][property];
                };

                var set = function (value) {
                    validateCaller(arguments.callee.caller, Class, this, property);

                    if (!writable) {
                        return;
                    }

                    if (oldSet) {
                        return oldSet.call(this, value);
                    }

                    this[INTERNAL_MEMBER] = this[INTERNAL_MEMBER] || {};
                    this[INTERNAL_MEMBER][property] = value;
                };

                get[OWNER] = Class;
                set[OWNER] = Class;
                descriptor.get = get;
                descriptor.set = set;
                delete descriptor.writable;
                delete descriptor.value;

                Object.defineProperty(Class.prototype, property, descriptor);
            }

            function validateCaller(caller, owner, instance, property) {
                // 子类是可以允许覆盖同名私有属性的，这里会从子类的内部属性存储区去拿相关值
                if (instance instanceof owner && instance.$self !== owner) {
                    return;
                }

                if (!caller || caller[OWNER] !== owner) {
                    throw new SyntaxError(property + ERR_ILLEGAL_CALL);
                }
            }


            return typeof Object.defineProperty === 'function' ? definePrivateMembers : function () {};
        }
    );
}(typeof define === 'function' && define.amd ? define :
        function (factory) {
            module.exports = factory(require);
        }
);