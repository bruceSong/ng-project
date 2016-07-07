/**
 * gulp插件
 * 为异步脚本映射关系添加hash
 */
'use strict';
var fs = require('fs');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var webpackConfig = require('./webpack.build.js');

module.exports = function(options) {
	if (!options) {
		throw new PluginError('asnychash', 'Missing options asnychash');
	}
	var keys = Object.keys(options.path.js);
	return through.obj(function(file, enc, cb) {
		// ignore empty files
	    if (file.isNull()) {
	    	this.emit('error', new PluginError('asnychash',  'file is empty'));
	        cb();
	        return;
	    }

	    // we don't do streams
	    if (file.isStream()) {
	        this.emit('error', new PluginError('asnychash',  'Streaming not supported'));
	        cb();
	        return;
	    }

	    var fileMap = [];
	    var buildFiles = fs.readdirSync(options.path.build + '/js');
	    buildFiles.forEach(function(file, n) {
	    	file = file.replace('.js', '');
	    	var hash = file.split('-');
	    	if (options.path.js[hash[0]]) {
	    		fileMap.push({
	    			name: hash[0],
	    			hashName: file
	    		});
	    	}
	    });

	    var contents = file.contents.toString();
	    fileMap.forEach(function(item) {
	    	var reg = new RegExp("pageJsHashName:(\'|\")" + item.name + "(\'|\")");
	    	contents = contents.replace(reg, "pageJsHashName:'" + item.hashName + "'");
	    });

	    if (webpackConfig.output.publicPath) {
	    	var reg = new RegExp("publicPath:(\'|\"){2}");
	    	contents = contents.replace(reg, "publicPath:'" + webpackConfig.output.publicPath + "'");
	    }

	    file.contents = new Buffer(contents);
	    this.push(file);
	    cb();
	});
};
