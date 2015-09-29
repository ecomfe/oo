/**
 * @file const 通用常量表
 * @author exodia(d_xinxin@163.com)
 */
void function (define) {
    define(
        function () {
            return {
                NAME: '__eooName__',
                OWNER: '__eooOwner__',
                INTERNAL_MEMBER: '__eooPrivateMembers__',
                PRIVATE_KEY: '$private',
                META: '__eooMeta__',
                ATTRIBUTE_PREFIX: '__eooAttribute__',
                EMPTY_DESCRIPTOR: {configurable: true, writable: true, enumerable: true, value: undefined}
            };
        }
    );
}(typeof define === 'function' && define.amd ? define :
        function (factory) {
            module.exports = factory(require);
        }
);
