'use strict';

function ActiveController($gloriaAPI, $scope, $timeout, $location,
		$gloriaLocale, $filter) {

	$scope.ready = false;
	$scope.active = [];

	$scope.objectClicked = function(obj) {
		$scope.objectSelected = obj;
		$scope.requestSuccess = false;
		$scope.requestLimit = false;
	};

	$gloriaAPI.getActivePlans(function(data) {
		console.log(data);
		$scope.active = data;
	}, function(error) {
	});

	$gloriaLocale.loadResource('active/lang', 'active', function() {
		$scope.ready = true;
	});

	$scope.$on('$destroy', function() {
		// $timeout.cancel($scope.timer);
	});
}
