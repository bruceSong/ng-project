var commonService = angular.module('commonService', []);

/**
 * hash格式化
 * 示例：$hash.getParams();
 */
commonService.factory('$hash', function() {
    var factory = {};
    factory.getParams = function() {
        return location.hash.replace(/(^#\/?)|(\/?$)/g, '').split('/');
    }
    return factory;
});

/**
 * 本地存储
 * 示例：$localStorage.debug = 1, delete $localStorage.debug;
 */
commonService.factory('$localStorage', _storageFactory('localStorage'));
commonService.factory('$sessionStorage', _storageFactory('sessionStorage'));
function _storageFactory(storageType) {
    return ['$rootScope', '$window', function($rootScope, $window) {
            // #9: Assign a placeholder object if Web Storage is unavailable to prevent breaking the entire AngularJS app
            var webStorage = $window[storageType] || (console.warn('This browser does not support Web Storage!'), {});
            var $storage = {
                    $default: function(items) {
                        for (var k in items) {
                            angular.isDefined($storage[k]) || ($storage[k] = items[k]);
                        }

                        return $storage;
                    },
                    $reset: function(items) {
                        for (var k in $storage) {
                            '$' === k[0] || delete $storage[k];
                        }

                        return $storage.$default(items);
                    }
                };
            var _last$storage;
            var _debounce;

            for (var i = 0, k; i < webStorage.length; i++) {
                // #8, #10: `webStorage.key(i)` may be an empty string (or throw an exception in IE9 if `webStorage` is empty)
                (k = webStorage.key(i)) && 'ngStorage-' === k.slice(0, 10) && ($storage[k.slice(10)] = angular.fromJson(webStorage.getItem(k)));
            }

            _last$storage = angular.copy($storage);

            $rootScope.$watch(function() {
                _debounce || (_debounce = setTimeout(function() {
                    _debounce = null;

                    if (!angular.equals($storage, _last$storage)) {
                        angular.forEach($storage, function(v, k) {
                            angular.isDefined(v) && '$' !== k[0] && webStorage.setItem('ngStorage-' + k, angular.toJson(v));

                            delete _last$storage[k];
                        });

                        for (var k in _last$storage) {
                            webStorage.removeItem('ngStorage-' + k);
                        }

                        _last$storage = angular.copy($storage);
                    }
                }, 100));
            });

            // #6: Use `$window.addEventListener` instead of `angular.element` to avoid the jQuery-specific `event.originalEvent`
            'localStorage' === storageType && $window.addEventListener && $window.addEventListener('storage', function(event) {
                if ('ngStorage-' === event.key.slice(0, 10)) {
                    event.newValue ? $storage[event.key.slice(10)] = angular.fromJson(event.newValue) : delete $storage[event.key.slice(10)];

                    _last$storage = angular.copy($storage);

                    $rootScope.$apply();
                }
            });

            return $storage;
        }
    ];
};

/**
 * 浏览器检测
 * 示例：注入后打印browser查看即可
 */
commonService.service('browser', function(){
  "use strict";

  var matched, browser;

  var uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
      /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      /(msie) ([\w.]+)/.exec( ua ) ||
      ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      [];

    var platform_match = /(ipad)/.exec( ua ) ||
      /(iphone)/.exec( ua ) ||
      /(android)/.exec( ua ) ||
      /(windows phone)/.exec( ua ) ||
      /(win)/.exec( ua ) ||
      /(mac)/.exec( ua ) ||
      /(linux)/.exec( ua ) ||
      /(cros)/i.exec( ua ) ||
      [];

    return {
      browser: match[ 3 ] || match[ 1 ] || "",
      version: match[ 2 ] || "0",
      platform: platform_match[ 0 ] || ""
    };
  };

  matched = uaMatch( window.navigator.userAgent );
  browser = {};

  if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.version);
  }

  if ( matched.platform ) {
    browser[ matched.platform ] = true;
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if ( browser.android || browser.ipad || browser.iphone || browser[ "windows phone" ] ) {
    browser.mobile = true;
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if ( browser.cros || browser.mac || browser.linux || browser.win ) {
    browser.desktop = true;
  }

  // Chrome, Opera 15+ and Safari are webkit based browsers
  if ( browser.chrome || browser.opr || browser.safari ) {
    browser.webkit = true;
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if ( browser.rv )
  {
    var ie = "msie";

    matched.browser = ie;
    browser[ie] = true;
  }

  // Opera 15+ are identified as opr
  if ( browser.opr )
  {
    var opera = "opera";

    matched.browser = opera;
    browser[opera] = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if ( browser.safari && browser.android )
  {
    var android = "android";

    matched.browser = android;
    browser[android] = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;

  return browser;
});