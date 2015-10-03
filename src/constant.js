/**
 * @file const 通用常量表
 * @author exodia(d_xinxin@163.com)
 */
(function (define) {
    define(
        function () {
            return {
                NAME: '__eooName__',
                OWNER: '__eooOwner__',
                INTERNAL_MEMBER: '__eooInternalMembers__',
                PRIVATE_STORE: '__eooPrivateStore__'
            };
        }
    );
})(typeof define === 'function' && define.amd ? define :
        function (factory) {
            module.exports = factory(require);
        }
);
