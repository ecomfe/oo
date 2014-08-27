/**
 * Created by exodia on 14-8-28.
 */
void function (define, undefined) {

    define(
        function (require) {
            var ATTRIBUTES = '__eooAttributes__';

            function simpleGetter() {
                return typeof this[ATTRIBUTES] === 'object' ? this[ATTRIBUTES][name] : undefined;
            }

            function simpleSetter(value) {
                this[ATTRIBUTES] = this[ATTRIBUTES] || {};
                this[ATTRIBUTES][name] = value;
            }

            return function (obj, name, accessor) {
                var upperName = name.charAt(0).toUpperCase() + name.slice(1);
                var getter = 'get' + upperName;
                var setter = 'set' + upperName;
                obj[getter] = !accessor || typeof accessor.get !== 'function' ? simpleGetter : accessor.get;
                obj[setter] = !accessor || typeof accessor.set !== 'function' ? simpleSetter : accessor.set;
            };
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });