/**
 * 路由扩展配置
 * templateProvider,resolve.loadController由架构默认设定，无需更改
 * 需用controller指定controller名称
 */
module.exports = {
    state: 'dialog',
    abstract: true,
    config: {
        controller: 'dialogController',
        resolve: {
            test: function() {
                console.log('dialog: resolve.test is run');
            }
        }
    }
};