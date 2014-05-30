'use strict';

function datepickerBase(scope, timeout) {
	scope.today = function() {
		scope.dt = new Date();
	};
	scope.today();

	scope.showWeeks = true;
	scope.toggleWeeks = function() {
		scope.showWeeks = !scope.showWeeks;
	};

	scope.clear = function() {
		scope.dt = null;
	};

	scope.current = new Date();
	scope.week = new Date(scope.current.getTime() + 518400000);

	// Disable weekend selection
	scope.disabled = function(date, mode) {
		return false;
	};

	scope.toggleMin = function() {
		scope.minDate = (scope.minDate) ? null : scope.current;
	};

	scope.toggleMin();

	scope.open = function() {
		timeout(function() {
			scope.opened = true;
		});
	};

	scope.dateOptions = {
		'year-format' : "'yy'",
		'starting-day' : 1
	};
}

function DatepickerCtrl($scope, $timeout) {
	datepickerBase($scope, $timeout);

	$scope.$watch('dt', function() {
		if ($scope.dt != undefined && $scope.dt != null) {
			$scope.$parent.date = $scope.dt;
		}
	});

	$scope.$on('$destroy', function() {
	});
}