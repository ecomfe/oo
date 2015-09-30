/**
 * @file static 基于对象的继承
 * @author exodia(d_xinxin@163.com)
 */
(function (define) {

    define(
        function (require) {
            function Empty() {}

            /**
             * create a new object with the specified prototype object and properties.
             * Just equals `Object.create` method.
             *
             * @param {Object} o The object which should be the prototype of the newly-created object.
             * @return {Object}
             */
            function createStatic(o) {
                if (!(o instanceof Object)) {
                    throw new TypeError('Argument must be an object');
                }
                Empty.prototype = o;
                return new Empty();
            }

            return typeof Object.create === 'function' ? Object.create : createStatic;
        }
    );

})(typeof define === 'function' && define.amd ? define :
        function (factory) {
            module.exports = factory(require);
        }
);
