/**
 * @file defineAccessor 测试用例
 * @author exodia(d_xinxin@163.com)
 */
describe('Class.defineAccessor', function () {
    var Class = null;
    beforeAll(function (done) {
        require(['eoo'], function (oo) {
            Class = oo;
            done();
        });
    });

    it('simple accessor', function () {
        var obj = {};
        Class.defineAccessor(obj, 'name');
        obj.setName('test');
        expect(obj.getName()).toEqual('test');
    });

    it('simple accessor', function () {
        var obj = {};
        var getCounter = 0;
        var setCounter = 0;
        Class.defineAccessor(obj, 'name', {
            set: function (value) {
                ++setCounter;
                this.name = value;
            },
            get: function () {
                ++getCounter;
                return this.name;
            }
        });
        Class.defineAccessor(obj, 'getCounter', {
            get: function () {
                return getCounter;
            }
        });
        Class.defineAccessor(obj, 'setCounter', {
            get: function () {
                return setCounter;
            }
        });
        obj.setName('test');
        expect(obj.getName()).toEqual('test');
        expect(obj.getGetCounter()).toEqual(1);
        expect(obj.getSetCounter()).toEqual(1);

        obj.setName('test2');
        expect(obj.getName()).toEqual('test2');
        expect(obj.getGetCounter()).toEqual(2);
        expect(obj.getSetCounter()).toEqual(2);
    });
});