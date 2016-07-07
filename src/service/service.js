var commonService = angular.module('commonService', []);
commonService.factory('$hash', function() {
    var factory = {};
    factory.getParams = function() {
        return location.hash.replace(/(^#\/?)|(\/?$)/g, '').split('/');
    }
    return factory;
});