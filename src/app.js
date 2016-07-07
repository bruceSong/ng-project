var angular = require('angular');
var uiRouter = require('angular-ui-router');
var bootstrap = require('angular-ui-bootstrap');
var oclazyload = require('oclazyload');
var service = require('./service/service');

var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'oc.lazyLoad', 'commonService']);
var $script = require('./assets/script.min.js');

var config = require('./config/config.js');

function getRouter(page, name, supName) {
    var pageName = supName ? supName + '/' + name : name;
    var defaultRouter = {
        url: '/' + name,
        templateProvider: ['$templateCache', '$q', function($templateCache, $q) {
            return window.cache['page/' + pageName + '/' + name + '.html'];
        }],
        controller: 'myController',
        resolve: {
            loadController: ['$ocLazyLoad', '$q', '$hash', function($ocLazyLoad, $q, $hash) {
                var hash = $hash.getParams();
                var promise = $q.when(1);
                var configItem;
                for(var i = 0; i < hash.length; i++) {
                    var _hash = hash[i];
                    configItem = i === 0 ? config.pageConfig[_hash] : configItem.subPage[_hash];
                    promise = andThen(config.publicPath + 'js/' + configItem.pageJsHashName + '.js');
                }
                return promise;
                function andThen(path) {
                    return promise.then(function() {
                        return $ocLazyLoad.load(path);
                    });
                }
            }]
        }
    };
    // 合并路由
    var router = require('./page/' + pageName + '/router.js');
    var routerConfig = angular.extend({}, defaultRouter, router.config);
    // 下面三个为受保护的，强制改回来
    routerConfig.url = defaultRouter.url;
    routerConfig.templateProvider = defaultRouter.templateProvider;
    routerConfig.resolve.loadController = defaultRouter.resolve.loadController;
    var state = supName ? supName + '.' + router.state : router.state;
    return {
        state: state,
        config: routerConfig,
        router: router
    };
}

app.config(function($stateProvider, $urlRouterProvider, $stateParamsProvider) {
    $urlRouterProvider.otherwise('/index');
    angular.forEach(config.pageConfig, function(page, name) {
        var router = getRouter(page, name);
        $stateProvider.state(router.state, router.config);
        if (page.subPage) {
            angular.forEach(page.subPage, function(subPage, subName) {
                var router = getRouter(subPage, subName, name);
                $stateProvider.state(router.state, router.config);
            });
        }
    });
});

app.run(function($rootScope, $state, $stateParams) {

});

angular.bootstrap(document, [app.name], {strictDi: true});