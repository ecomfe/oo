/**
 * @file util 工具类
 * @author exodia(d_xinxin@163.com)
 */
(function (define) {

    define(
        function () {
            var nativeIndexOf = Array.prototype.indexOf;
            var hasEnumBug = !({toString: 1}.propertyIsEnumerable('toString'));
            var enumProperties = [
                'constructor',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'toString',
                'toLocaleString',
                'valueOf'
            ];

            /**
             * hasOwnProperty 函数的封装
             *
             * @ignore
             * @param {Object} obj 对象
             * @param {string} key 属性名
             * @return {boolean}
             */
            function hasOwn(obj, key) {
                return Object.prototype.hasOwnProperty.call(obj, key);
            }

            /**
             * 遍历对象操作
             *
             * @ignore
             * @param {Object} obj 目标对象
             * @param {Function} fn 遍历操作
             */
            function eachObject(obj, fn) {
                for (var k in obj) {
                    hasOwn(obj, k) && fn(obj[k], k, obj);
                }
                // ie6-8 enum bug
                if (hasEnumBug) {
                    for (var i = enumProperties.length - 1; i > -1; --i) {
                        var key = enumProperties[i];
                        hasOwn(obj, key) && fn(obj[key], key, obj);
                    }
                }
            }

            function indexOf(arr, el) {
                if (typeof nativeIndexOf === 'function' && arr.indexOf === nativeIndexOf) {
                    return arr.indexOf(el);
                }

                for (var i = 0, len = arr.length; i < len; ++i) {
                    if (arr[i] === el) {
                        return i;
                    }
                }

                return -1;
            }

            function addToSet(arr, el) {
                indexOf(arr, el) === -1 && arr.push(el);
            }

            return {
                hasOwn: hasOwn,
                eachObject: eachObject,
                indexOf: indexOf,
                addToSet: addToSet
            };
        }
    );

})(typeof define === 'function' && define.amd ? define : function (factory) {
        module.exports = factory(require);
    }
);
