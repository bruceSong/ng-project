/**
 * gulp插件
 * 把*.html.js合并到对应该js入口文件的包里
 */
'use strict';
var fs = require('fs');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');

module.exports = function (options) {
    if (!options) {
        throw new PluginError('concatHtml2Js', 'Missing options asnychash');
    }

    return through.obj(function (file, enc, cb) {
        // ignore empty files
        if (file.isNull()) {
            this.emit('error', new PluginError('concatHtml2Js', 'file is empty'));
            cb();
            return;
        }

        // we don't do streams
        if (file.isStream()) {
            this.emit('error', new PluginError('concatHtml2Js', 'Streaming not supported'));
            cb();
            return;
        }

        // 求取js文件路径
        var baseJsPath = options.path.build + '/js/';
        var history = file.history[0].replace('.html.js', '');
        history = history.split('\\').reverse();
        history.shift();
        if (history[1] === 'page') {
            var jsPath = baseJsPath + history[0] + '.js';
        } else {
            var jsPath = baseJsPath + history[1] + '_' + history[0] + '.js';
        }
        if (fs.existsSync(path.resolve(jsPath))) {
            var jsFile = fs.readFileSync(jsPath);
            jsFile = jsFile.toString() + file.contents.toString();
            fs.writeFileSync(jsPath, jsFile);
        }
        this.push(file);
        cb();
    });
};
