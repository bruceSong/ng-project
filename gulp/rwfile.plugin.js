/**
 * gulp插件
 * 根据正则，对文件内容进行替换操作
 */
'use strict';
var fs = require('fs');
var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

module.exports = function(patterns) {
	if (!patterns) {
		throw new PluginError('rwfile', 'Missing patterns asnychash');
	}

	return through.obj(function(file, enc, cb) {
		// ignore empty files
	    if (file.isNull()) {
	    	this.emit('error', new PluginError('rwfile',  'file is empty'));
	        cb();
	        return;
	    }

	    // we don't do streams
	    if (file.isStream()) {
	        this.emit('error', new PluginError('rwfile',  'Streaming not supported'));
	        cb();
	        return;
	    }

	    // params error
	    if (Object.prototype.toString.call(patterns) !== '[object Array]') {
	        this.emit('error', new PluginError('rwfile',  'params error'));
	        cb();
	        return;
	    }

	    var contents = file.contents.toString();
	    patterns.forEach(function(item) {
	    	if (item.pattern && typeof item.value === 'string') {
	    		contents = contents.replace(item.pattern, item.value);
	    	}
	    });
	    file.contents = new Buffer(contents);
	    this.push(file);
	    cb();
	});
};
