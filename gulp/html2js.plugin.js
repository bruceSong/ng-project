/**
 * webpack插件
 * 把模板转化成js文件
 */
var _ = require( 'lodash' ),
    FS = require('fs-extra'),
    Path = require('path');

function Html2JsPlugin( paths, options ) {
    this.paths = paths;
    this.sourceRoot = options.sourceRoot || '';
    this.targetRoot = options.targetRoot || '';
    if ( !_.isArray( paths ) ) {
        throw new Error( 'Html2JsPlugin: paths must be an array' );
    }
}

Html2JsPlugin.prototype = {
    paths: [],
    sourceRoot: '',
    targetRoot: '',
    apply: function(compiler) {
        var me =this;
        function process(path) {
            var stat = FS.statSync(Path.join(me.sourceRoot, path));
            if ( stat.isDirectory() ) {
                processDirectory(path)
            } else {
                processFile(path);
            }
        }
        var rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            meta = { // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            },
            quote = function (string) {
                // If the string contains no control characters, no quote characters, and no
                // backslash characters, then we can safely slap some quotes around it.
                // Otherwise we must also replace the offending characters with safe escape
                // sequences.
                rx_escapable.lastIndex = 0;
                if (rx_escapable.test(string)) {
                    return '"' + string.replace(rx_escapable, function (a) {
                            var c = meta[a];
                            if (typeof c === 'string') {
                                return c;
                            } else {
                                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                            }
                        }) + '"';
                } else {
                    return '"' + string + '"';
                }
            };
        function processFile(filepath) {
            if ( /\.html$/.test(filepath) ) {
                var html = FS.readFileSync( Path.join(me.sourceRoot, filepath), 'utf-8' );
                writeFile(filepath, wrap(filepath, quote(html).replace(/\s+/g, ' ')));
            }
        }
        function processDirectory(directory) {
            var files = FS.readdirSync(Path.join(me.sourceRoot, directory));
            if ( !files || !files.length ){
                return;
            }
            files.forEach(function(file) {
                process(Path.join(directory, file));
            })
        }

        function writeFile(path, content) {
            var abp = Path.join(me.targetRoot, path);
            FS.mkdirs(Path.dirname(abp), function(err){
                if (err) {
                    throw new Error(err);
                }
                FS.writeFile(abp + '.js', content, 'utf-8');
            });        }

        function wrap(filepath, html) {
            return 'window.cache = window.cache || {};window.cache[\'' + unix(filepath) + '\']=' + escape(html) +';';
        }

        function escape(html) {
            return html;
            //return html.replace(/'/g, '\'').replace(/\s+/g, '');
        }

        function unix(path) {
            return path.replace(/\\/g, '/');
        }

        compiler.plugin( 'emit', function ( compilation, callback ) {
            me.paths.forEach(function(path){
                process(unix(path));
            });
            callback();
        } );
    }
};

module.exports = Html2JsPlugin;