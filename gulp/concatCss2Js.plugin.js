/**
 * gulp插件
 * 把*.html.js合并到对应该js入口文件的包里
 */
'use strict';
var fs = require('fs');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
var meta = { // table of character substitutions
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"': '\\"',
    '\\': '\\\\'
};
var quote = function (string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    rx_escapable.lastIndex = 0;
    if (rx_escapable.test(string)) {
        return string.replace(rx_escapable, function (a) {
            var c = meta[a];
            if (typeof c === 'string') {
                return c;
            } else {
                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }
        });
    } else {
        return string;
    }
};

module.exports = function(options) {
	if (!options) {
		throw new PluginError('concatHtml2Js', 'Missing options asnychash');
	}

	return through.obj(function(file, enc, cb) {
		// ignore empty files
	    if (file.isNull()) {
	    	this.emit('error', new PluginError('concatHtml2Js',  'file is empty'));
	        cb();
	        return;
	    }

	    // we don't do streams
	    if (file.isStream()) {
	        this.emit('error', new PluginError('concatHtml2Js',  'Streaming not supported'));
	        cb();
	        return;
	    }

	    // 求取js文件路径
	    var filename = file.history[0].replace('.css', '').split(/\\|\//g).slice(-1)[0];
	    var content = file.contents.toString();
	    content = quote(content);

	    var jsPath = options.path.build + '/js/' + filename + '.js'; 
	    var jsContent = fs.readFileSync(jsPath);
	    jsContent = jsContent.toString();
	    jsContent = jsContent.replace('<style></style>', '<style>' + content + '</style>');
	    fs.writeFileSync(jsPath, jsContent);
	    this.push(file);
	    cb();
	});
};
