var fs = require('fs');
var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var Html2JsPlugin = require('./html2js.plugin');
var config = require('./config');
var extend = require('./extend');
var preloaders = require('./preloaders');
var loaders = require('./loaders');

module.exports = {
    entry: extend({
        app: [config.path.src + '/app.js'],
        vendors: ['angular', 'angular-ui-router', 'angular-ui-bootstrap', 'oclazyload']
    }, config.path.js),
    output: {
        path: __dirname + config.path.build,
        //publicePath: '/op/demo/build',
        filename: 'js/[name].js',
    },
    resolve: require('./resolve'),
    watch: false,
    module: {
        preLoaders: preloaders,
        loaders: loaders
    },
    //devtool: 'source-map',
    postcss: function() {
      return [autoprefixer];
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new Html2JsPlugin([
            'page'
        ], {
            sourceRoot: config.path.src,
            targetRoot: config.path.build
        }),
        // css打包
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        new webpack.optimize.DedupePlugin(),
        // html模板自动注入打包后的文件
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            inject: 'body',
            excludeChunks: Object.keys(config.path.js)
        })//,
        //new ExtractTextPlugin('common.css'),
        // 分离公用js模块
        //new webpack.optimize.CommonsChunkPlugin('common.js', Object.keys(config.path.js)),//分离公用模块
        //new webpack.optimize.CommonsChunkPlugin('vendors', 'js/vendors.js')//分离库
    ]
}