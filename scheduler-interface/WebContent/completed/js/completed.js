'use strict';

function CompletedController($gloriaAPI, $scope, $timeout, $location,
		$gloriaLocale, $filter) {

	$scope.ready = false;
	$scope.completed = [];

	$gloriaAPI.getInactivePlans(function(data) {
		
		data.forEach(function(plan) {
			if (plan.state == 'DONE') {
				$scope.completed.push(plan);
			}
		});
		
		console.log($scope.completed);
	}, function(error) {
	});

	$gloriaLocale.loadResource('completed/lang', 'completed', function() {
		$scope.ready = true;
	});

	$scope.$on('$destroy', function() {
		// $timeout.cancel($scope.timer);
	});
}
