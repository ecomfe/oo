/**
 * @file private 私有成员特性支持
 * @author exodia(d_xinxin@163.com)
 */
(function (define) {

    define(
        function (require) {
            var TOKEN = require('./constant').INSTANCE_TOKEN;
            var inheritObject = require('./static');

            function PrivateStore(prototype) {
                this.store = {};
                this.uuid = 0;
                this.prototype = prototype || {};
            }

            PrivateStore.prototype.get = function (instance) {
                if (!instance.hasOwnProperty(TOKEN)) {
                    instance[TOKEN] = ++this.uuid;
                }

                var token = instance[TOKEN];
                this.store[token] = this.store[token] || inheritObject(this.prototype);
                return this.store[token];
            };

            return function createPrivate(prototype) {
                var store = new PrivateStore(prototype);
                return function getPrivate(instance) {
                    return store.get(instance);
                };
            };
        }
    );

})(typeof define === 'function' && define.amd ? define :
        function (factory) {
            module.exports = factory(require);
        }
);
