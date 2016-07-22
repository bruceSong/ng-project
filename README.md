## 编译说明
1. `npm i`安装依赖包
2. `gulp`或`gulp dev`本地开发
3. `gulp build`正式发布
4. `gulp clean`清除build目录

## 使用命令行
* 创建应用
    * 一级页面：`gulp add -k subway`，`subway`为页面名
    * 二级页面：`gulp add -k subway_dialog`，`subway_dialog`为一级页面名加二级页面名，用下划线分割
* 删除应用
    * 一级页面：`gulp rm -k subway`，`subway`为页面名
    * 二级页面：`gulp rm -k subway_dialog`，`subway_dialog`为一级页面名加二级页面名，用下划线分割
    
## 本地服务代理
开发过程使用`browser-sync`做为本地服务，根目录下`proxy.json`为配置文件，以下示例为汇聚op项目的代理配置      
`{
    "proxies": [
        {
            "path": "/(login|resources|logout|g/api|getcaptcha)",
            "proxy": "172.31.103.107:8080"
        },
        {
            "path": "/(op/api|op/s/api)",
            "proxy": "172.31.103.107"
        }
    ]
}`      
`http://localhost:8080/login`将被转发到`http://172.31.103.107:8080/login`

## 手动创建一级页面
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

## 手动创建二级页面
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
构建过程从功能上分为三大块：`webpack基础打包`、`gulp文件合并`和`gulp分步添加md5及垃圾文件清除`
* webpack基础打包
    * 根据`webpack`配置实现`js`、`css`、`html`和`json`等文件的模块化管理，并生成基本打包文件
    * 打包入口文件包括`app`、`vendors`和每个`router`的`controller`，`controller`入口文件在`gulp/config.js`配置
    * 编写`webpack`插件`html2js.plugin.js`，实现`html`文件到`js`文件之间的转化，如`./src/page/index/index.html`将被转化为`./build/page/index/index.html.js`
    * 经`webpack`初步构建，中间目录如下，可过行`gulp webpack`查看`build目录`
        * js&nbsp;&nbsp;&nbsp;&nbsp;//js打包文件放置目录
            * app.js&nbsp;&nbsp;&nbsp;&nbsp;//app入口打包文件
            * index.js&nbsp;&nbsp;&nbsp;&nbsp;//首页controller打包文件
            * index_dialog.js&nbsp;&nbsp;&nbsp;&nbsp;//首页下dialog页面打包文件
            * vendor.js&nbsp;&nbsp;&nbsp;&nbsp;//框加包
        * page&nbsp;&nbsp;&nbsp;&nbsp;//html转js文件的中间文件，后面会被gulp合并到js下对应的js文件，然后清除
            * index
                * index.html.js
                * dialog/dialog.html.js
        * index.css&nbsp;&nbsp;&nbsp;&nbsp;//首页用到的css模块
        * index.html&nbsp;&nbsp;&nbsp;&nbsp;//入口页面，需同步引用的打包文件会自动注入到该文件
        * index_dailog.css&nbsp;&nbsp;&nbsp;&nbsp;//首页下dialog页面用到的css模块
* `gulp`文件处理
    * `gulp concat`，合并`index.css`，`index_dialog.css`到`connom.css`
    * `gulp rmLinkCommonJsCss`，通过`rwfile.plugin.js`插件清除`index.html`对`common.js.css`的引用
    * `gulp concatHtml2Js`，通过`concatHtml2Js.plugin.js`插件把*.html.js合并到对应js文件
* `gulp`分步加戳
    * 对需同步引用的包加`md5`戳，并把`md5`同步到html里对包的引用
    * 通过`asynchash.plugin.js`插件修改`app.js`，把异步加载的包的`md5`戳同步到`app.js`
    * 对`app.js`加戳并同步到html对`app.js`的引用
    * 清除不必要文件
