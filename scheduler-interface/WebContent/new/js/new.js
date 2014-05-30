'use strict';

function NewObservationController($gloriaAPI, $scope, $timeout, $location,
		$gloriaLocale, $filter) {

	$scope.ready = false;

	$scope.objectClicked = function(obj) {
		$scope.objectSelected = obj;
		$scope.requestSuccess = false;
		$scope.requestLimit = false;
	};

	$scope.request = function() {
		$gloriaAPI.requestObservation($scope.objectSelected, function(data) {
			//alert(data);
			$scope.requestSuccess = true;
			$scope.requestLimit = false;
		}, function(error) {
			//alert(error);
			$scope.requestSuccess = false;
			$scope.requestLimit = true;
		});
	};

	$scope.objects = [ {
		id : 'M1',
		style : {
			backgroundImage : 'url(new/img/M1.png)'
		}
	}, {
		id : 'M8',
		style : {
			backgroundImage : 'url(new/img/M8.png)'
		}
	}, {
		id : 'NGC891',
		style : {
			backgroundImage : 'url(new/img/NGC891.png)'
		}
	}, {
		id : 'M45',
		style : {
			backgroundImage : 'url(new/img/M45.png)'
		}
	}, {
		id : 'NGC1499',
		style : {
			backgroundImage : 'url(new/img/NGC1499.png)'
		}
	}, {
		id : 'jupiter',
		style : {
			backgroundImage : 'url(new/img/JUPITER.png)'
		}
	}, {
		id : 'M31',
		style : {
			backgroundImage : 'url(new/img/M31.png)'
		}
	}, {
		id : 'NGC278',
		style : {
			backgroundImage : 'url(new/img/NGC278.png)'
		}
	} ];

	$gloriaLocale.loadResource('new/lang', 'new', function() {
		$scope.ready = true;
	});

	$scope.$on('$destroy', function() {
		// $timeout.cancel($scope.timer);
	});
}
