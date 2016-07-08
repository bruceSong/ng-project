## 编译说明
1. `npm i`安装依赖包
2. `gulp`或`gulp dev`本地开发
3. `gulp build`正式发布

## 新建一个一级页面
1. `gulp/config.js`下`path.js`添加一条配置，`key`为页面名称，`value`为`controller`路径      
例如：新增页面`page/index`，那么`path.js.index = ['./src/page/index/controller.js']`        
说明：`path.js`为打包配置，上例中`index`页面用到的`js`会被打包成`index-0d8d1875a9.js`
2. `src/config/config.js`下`pageConfig`添加一条配置，接上例，则配置如下：       
`pageConfig: {
        index: {        
            pageJSHashName: 'index'     
        }       
}`      
`index`为页面名称，`pageJSHashName`无需改动，其值也为页面名称       
说明：该配置的主要作用为把编译过程中生成的md5戳同步到异步加载的模块
3. 按照`ng-demo`中的示例添加页面，如`page/index`下包含`controller.js`、`index.html`、`router.js`、`index.css`，样式表可没有       
`特别强调：`除样式表可随意命名外，其余文件均不能随意改写，且`html`文件名必须和页面名称一致
4. 定义自己的`controller`模块，`controller`名不能和其他模块重名，`router.js`需指定`controller`

## 新建一个二级页面
1. 同上面中的步骤1，如新建`page/index/layout`，则`path.js.index_layout = ['./src/page/index/layout/controller.js']`     
注：`key`值为一级页面名加二级页面名，中间用`'_'`分割
2. 同上面中的步骤2，只不过`pageJSHashName`的值也为一级页面名加二级页面名，中间用`'_'`分割
3. 同上面的步骤3、4

## 架构特色
1. 基于`webpack`实现了`js`、`css`、`html`、`json`等文件的模块化`css`、`html`、`json`都可以通过`require`在`js`里引入
2. 合理的打包策略，目前`css`所有通过`require`引入的`css`都会打成一个包`common.css`      
同步引入的`js`有三个包，`vendors.js`、`common.js`、`app.js`，分别为框架包，公共模块包和入口文件包       
另外每个`router`下的页面对应一个异步加载的包，其成份包括`controller`及里面通过`require`引入的模块和当前页面的模块
3. 自动化`router`设计，构建过程会自动创建`router`，用户无需再关注`angularJS`里的`router`设计        
如：`'page/index'`的`router`为`#/index`，`'page/index/layout'`的`router`为`#/index/layout`
4. `gulp`的灵活应用，`gulp`在`webpack`的基础上，实现了必要文件合并、垃圾文件删除、分步加`md5`戳、异步模块同步`md5`等功能

## 构建过程深度剖析