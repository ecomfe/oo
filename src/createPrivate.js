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

            var getUUID = function () {
                return ++uuid;
            };

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
                prototype = prototype || Object.prototype;
                var token = getUUID();

                var getPrivate = function getPrivate(instance) {

                    if (!instance.hasOwnProperty(STORE)) {
                        instance[STORE] = {};
                    }

                    var store = instance[STORE];
                    if (store.hasOwnProperty('' + token)) {
                        return store[token];
                    }

                    store[token] = inheritObject(prototype);
                    return store[token];
                };

                getPrivate.getPrototype = function () {
                    return prototype;
                };
                getPrivate.setPrototype = function (value) {
                    prototype = value;
                };

                return getPrivate;
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
