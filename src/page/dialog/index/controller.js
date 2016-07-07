require('./dialog.css');
var ngDialog = require('components/ngDialog/ngDialog');
angular.module('app', ['ngDialog']).controller('dialogIndexController', function($scope, ngDialog) {
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
    $scope.hash = hash + "=dialog";
});
