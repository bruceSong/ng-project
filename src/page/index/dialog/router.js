/**
 * 路由扩展配置
 * templateProvider,resolve.loadController由架构默认设定，无需更改
 * 需用controller指定controller名称
 */
module.exports = {
    state: 'index',
    config: {
        controller: 'indexDialogController',
        resolve: {
            test: function() {
                console.log('dialog.index: resolve.test is run');
            }
        }
    }
};