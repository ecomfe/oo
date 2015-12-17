/**
 * @file main 入口文件
 * @author exodia(d_xinxin@163.com)
 */
(function (define) {
    define(
        function (require) {
            var oo = require('./class');
            oo.defineAccessor = require('./defineAccessor');
            oo.static = require('./static');
            oo.createPrivate = require('./createPrivate');
            oo.defineProtect = require('./defineProtect');

            return oo;
        }
    );
})(
    typeof define === 'function' && define.amd
        ? define
        : function (factory) {
            module.exports = factory(require);
        }
);
