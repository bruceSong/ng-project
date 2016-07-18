var ngDialog = require('components/ngDialog/ngDialog');
require('./index.css');

angular.module('app', ['ngDialog']).controller('indexController', function($scope, ngDialog) {
	var hash = location.hash.replace('#/', '');
	$scope.clickToOpen = function () {
        ngDialog.open({
		    template: '<p>my template</p><p>from: {{hash}}</p>',
		    controller: ['$scope', function($scope) {
		        $scope.hash = hash;
		    }],
		    plain: true
		});
    };
    $scope.hash = hash + "=index";
});