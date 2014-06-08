void function (define) {
    define(function (require) {
        return require('./src/oo');
    });

}((typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }));