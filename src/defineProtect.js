/**
 * @file protect.js proviede protect member feature
 * @author exodia(d_xinxin@163.com)
 */
(function (define) {

    define(
        function (require) {
            var META = require('./constant').META;
            var u = require('./util');
            var inheritStatic = require('./static');

            function defineProtect(Class, privateToken) {
                Class[META] = Class[META] || {};
                Class[META].protectToken = privateToken;
                if (Class.$superClass && Class.$superClass[META] && Class.$superClass[META].protectToken) {
                    var parentProtect = Class.$superClass[META].protectToken.getPrototype();
                    var currentProtect = privateToken.getPrototype();
                    var protectInstance = inheritStatic(parentProtect);
                    u.eachObject(currentProtect, function (value, key) {
                        protectInstance[key] = value;
                    });
                    protectInstance.$super = parentProtect;
                    privateToken.setPrototype(protectInstance);
                }
            }

            return defineProtect;
        }
    );

}(
    typeof define === 'function' && define.amd
        ? define
        : function (factory) {
        module.exports = factory(require);
    }
));
