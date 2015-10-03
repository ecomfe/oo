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

})(typeof define === 'function' && define.amd ? define :
        function (factory) {
            module.exports = factory(require);
        }
);
