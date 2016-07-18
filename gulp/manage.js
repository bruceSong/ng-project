/**
 * app管理，实现增删清除页面功能
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var minimist = require('minimist');

var config = require('./config.js');
var srcConfig = require('../src/config/config.js');

var source = path.join(__dirname, '../', './source');
var gulpConfigPath = path.join(__dirname, './config.js');
var srcConfigPath = path.join(__dirname, '../',  './src/config/config.js');

var param = process.argv.slice(2);
var options = minimist(param);

gulp.task('add', function() {
    if (options.k) {
        var page = options.k.split('_').slice(0, 2);
        var isOK = check(page);
        if (!isOK) {
            return;
        }
        // 读写gulp/config.js
        var gulpConfig = fs.readFileSync(gulpConfigPath, 'utf8');
        gulpConfig = gulpConfig.toString().split(/\r\n|\n|\r/);

        var toInsert = false;
        var gulpConfigPark = [];
        gulpConfig.forEach(function(line, i) {
            if ((/\s*js\s*:\s+\{/).test(line)) {
                toInsert = true;
            }
            if (toInsert && (/\s*\}\s*/).test(line)) {
                if (!(/,$/).test(gulpConfigPark[i - 1])) {
                    gulpConfigPark[i - 1] += ",";
                }
                var entry = fs.readFileSync(source + '/entry.js', 'utf8');
                entry = entry.toString();
                gulpConfigPark.push(entry.replace('entryName', options.k).replace('entryPath', page.join('/')));
                toInsert = false;
            }
            gulpConfigPark.push(line);
        });
        fs.writeFile(gulpConfigPath, gulpConfigPark.join('\r\n'), function() {
            gutil.log(chalk.cyan('write gulp/config.js successfully'));
        });

        // 读写src/config/config.js
        var routeConfig = fs.readFileSync(srcConfigPath, 'utf8');
        routeConfig = routeConfig.toString().split(/\r\n|\n|\r/);
        var routeConfigPark = [];
        var toInsert = false;
        routeConfig.forEach(function(line, i) {
            if ((/\s*pageConfig\s*:\s*\{/).test(line)) {
                toInsert = true;
            }

            var next = routeConfig[i + 2];
            if (page.length === 1) {
                if (toInsert && (/\s*\}\s*/).test(line) && !next) {
                    routeConfigPark[i - 1] += ',';

                    var hash = fs.readFileSync(source + '/hash.js');
                    hash = hash.toString();

                    hash = hash.replace(/@page/g, page[0]);
                    if (page.length === 1) {
                        hash = hash.replace(/,*\r*\s*\'subPage\'\s*:\s*\{[^{}]+\{[^{}]+\}[^{}]+\}/, '');
                    }

                    if (page.length === 2) {
                        hash = hash.replace(/@subpage/g, page[1]);
                    }

                    routeConfigPark.push(hash);

                    toInsert = false;
                }
            } else {
                var hasReg = new RegExp("\s*\'pageJsHashName\'\s*:(\s*| )\'" + page[0] + "\'");
                if (srcConfig.pageConfig[page[0]].subPage) {
                    var beLine = routeConfigPark[i - 2];
                    if (toInsert && beLine && hasReg.test(beLine)) {
                        var subhash = fs.readFileSync(source + '/subhash.js');
                        subhash = subhash.toString();
                        subhash = subhash.replace(/@subpage/g, page[1]).replace(/@page/g, page[0]);
                        routeConfigPark.push(subhash);
                        toInsert = false;
                    }
                } else {
                    var beLine = routeConfigPark[i - 1];
                    if (toInsert && hasReg.test(beLine)) {
                        if (!(/,\s*$/).test(beLine)) {
                            routeConfigPark[i - 1] += ',';
                        }
                        var subhashfirst = fs.readFileSync(source + '/subhashfirst.js');
                        subhashfirst = subhashfirst.toString();
                        subhashfirst = subhashfirst.replace(/@subpage/g, page[1]).replace(/@page/g, page[0]);
                        routeConfigPark.push(subhashfirst);
                        toInsert = false;
                    }
                }

            }
            routeConfigPark.push(line);
        });
        fs.writeFile(srcConfigPath, routeConfigPark.join('\r\n'), function() {
            gutil.log(chalk.cyan('write src/config/config.js successfully'));
        });

        // copy页面
        if (page.length === 1) {
            var controllerName = page[0] + 'Controller';
            var pageName = page[0];
        } else {
            var controllerName = page[0] + page[1] + 'Controller';
            var pageName = page[1];
        }

        var controllerPath = path.join(__dirname, '../', './src/page/' + page.join('/'));
        fs.mkdirSync(controllerPath);

        var controller = fs.readFileSync(source + '/controller.js');
        controller = controller.toString();
        controller = controller.replace(/controllerName/g, controllerName);
        controller = controller.replace(/@pageName/g, pageName);
        fs.writeFile(controllerPath + '/controller.js', controller, function() {
            gutil.log(chalk.cyan('write controller.js successfully'));
        });

        var router = fs.readFileSync(source + '/router.js');
        router = router.toString();
        router = router.replace(/controllerName/g, controllerName);
        router = router.replace(/pageName/g, pageName);
        fs.writeFile(controllerPath + '/router.js', router, function() {
            gutil.log(chalk.cyan('write router.js successfully'));
        });

        var html = fs.readFileSync(source + '/index.html');
        html = html.toString();
        html = html.replace(/pageName/g, pageName);
        fs.writeFile(controllerPath + '/' + pageName + '.html', html, function() {
            gutil.log(chalk.cyan('write ' + pageName + '.html successfully'));
        });

        var less = fs.readFileSync(source + '/index.less');
        less = less.toString();
        fs.writeFile(controllerPath + '/' + pageName + '.less', less, function() {
            gutil.log(chalk.cyan('write ' + pageName + '.less successfully'));
        });
    }
});

gulp.task('rm', function() {
    if (options.k) {
        var page = options.k.split('_').slice(0, 2);
        // 文件名是否合法
        if (!(/^[a-z]+_*[a-z]+$/).test(options.k)) {
            gutil.log(chalk.red('the page name is made of a-z'));
            return false;
        }

        if (!config.path.js[page[0]]) {
            gutil.log(chalk.red('the page ' + page[0] + ' is not exist'));
            return false;
        }

        if (!config.path.js[options.k]) {
            gutil.log(chalk.red('the page ' + options.k + ' is not exist'));
            return false;
        }

        var subPage = srcConfig.pageConfig[page[0]] && srcConfig.pageConfig[page[0]].subPage;
        if (page.length === 1 && subPage) {
            gutil.log(chalk.red('please remove the subpage of ' + page[0] + ' first'));
            return false;
        }

        if (page.length === 2 && !subPage[page[1]]) {
            gutil.log(chalk.red('the subpage ' + page[1] + ' of ' + page[0] + ' is not exist'));
            return false;
        }

        var gulpConfig = fs.readFileSync(gulpConfigPath);
        gulpConfig = gulpConfig.toString();
        var pattern = new RegExp(',*\\\s*' + options.k + '\\\s*:\\\s*\\\[[^\\\[\\\]]+\\\]');
        gulpConfig = gulpConfig.replace(pattern, '');
        fs.writeFile(gulpConfigPath, gulpConfig);

        var srcConfigCon = fs.readFileSync(srcConfigPath);
        srcConfigCon = srcConfigCon.toString();


        if (page.length === 1) {
            var pattern = new RegExp(',*\\\s*\\\'' + options.k + '\\\'([^\\\{\\\}]*)\\\{([^\\\{\\\}]+)\\\}');
        } else {
            var pattern = new RegExp(',*\\\s*\\\'' + page[1] + '\\\'([^\\\{\\\}]*)\\\{([^\\\{\\\}]+)' + options.k + '([^\\\{\\\}]*)\\\}');
        }
        var noneSubPage = new RegExp(',*\\\s*\\\'*subPage\\\'*([^\\\{\\\}]*)\\\{[\\\s\\\t\\\r]*\\\}');
        srcConfigCon = srcConfigCon.replace(pattern, '');
        srcConfigCon = srcConfigCon.replace(noneSubPage, '');
        fs.writeFile(srcConfigPath, srcConfigCon);

        var pagePath = path.join(__dirname, '../src/page', page.join('/'));
        if (fs.existsSync(pagePath)) {
            files = fs.readdirSync(pagePath);
            files.forEach(function(file) {
                var curPath = pagePath + "/" + file;
                if (!fs.statSync(curPath).isDirectory()) {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdir(pagePath, function(err) {
                console.log(err);
            });
        }
    }
});

gulp.task('rename', function() {
    if (options.k) {
        var page = options.k.split('_').slice(0, 2);
        // 文件名是否合法
        if (!(/^[a-z]+_*[a-z]+2[a-z]+_*[a-z]+$/).test(options.k)) {
            gutil.log(chalk.red('the page name is made of a-z'));
            return false;
        }
    }
});

function check(page) {
    // 文件名是否合法
    if (!(/^[a-z]+_*[a-z]+$/).test(options.k)) {
        gutil.log(chalk.red('the page name is made of a-z'));
        return false;
    }
    // 页面是否存在
    if (page.length === 1 && config.path.js[options.k]) {
        //gutil.log(chalk.cyan('page ' + options.k + ' is already exist'));
        gutil.log(chalk.red('page ' + options.k + ' is already exist'));
        return false;
    }
    if (page.length === 2 && !srcConfig.pageConfig[page[0]]) {
        gutil.log(chalk.red('page ' + page[0] + ' is not exist'));
        return false;
    }

    var fpage = srcConfig.pageConfig[page[0]];
    if (page.length === 2 && fpage && fpage.subPage && fpage.subPage[page[1]]) {
        gutil.log(chalk.red('page ' + page[0] + ' is already exist'));
        return false;
    }

    return true;
}