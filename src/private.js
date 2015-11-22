/**
 * @file private 私有成员特性支持
 * @author exodia(d_xinxin@163.com)
 */
(function (define) {

    define(
        function (require) {
            var STORE = require('./constant').PRIVATE_STORE;
            var inheritObject = require('./static');
            var uuid = 0;

            /**
             * create a private object whose prototype points the first param if has,
             * and return a token function which accept an object as param,
             * call the token function with an object, it will return the private part of the object,
             * because the private part is just a object, you can do any operation on it.
             *
             * @param {Object} [prototype] the private properties on the prototype, all instance will share them.
             * @return {Function} a token function which accept an object,
             * it will return the private part of the object, and do not expose the token function to the outside.
             */
            return function createPrivate(prototype) {
                var token = ++uuid;
                return function getPrivate(instance) {
                    if (!instance.hasOwnProperty(STORE)) {
                        instance[STORE] = {};
                    }

                    var store = instance[STORE];
                    store[token] = store[token] || inheritObject(prototype);
                    return store[token];
                };
            };
        }
    );

})(
    typeof define === 'function' && define.amd
        ? define
        : function (factory) {
            module.exports = factory(require);
        }
);
