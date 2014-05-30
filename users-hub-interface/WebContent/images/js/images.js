'use strict';

/*toolbox.lazy.directive('ngElevateZoom', function() {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			console.log("Linking");

			// Will watch for changes on the attribute
			attrs.$observe('zoomImage', function() {
				linkElevateZoom();
			});

			attrs.$observe('ng-elevate-zoom', function() {
				linkElevateZoom();
			});

			function linkElevateZoom() {
				if (attrs.ngElevateZoom == 'inactive')
					return;
				// Check if its not empty
				if (!attrs.zoomImage)
					return;
				element.attr('data-zoom-image', attrs.zoomImage);
				$(element).elevateZoom({
					zoomType : "lens",
					lensShape : "round",
					lensSize : 150
				});
			}

			linkElevateZoom();
		}
	};
});*/

function loadImages(scope, $gloriaAPI, date, timeout) {
	scope.slides = [];

	if (date != null) {

		$gloriaAPI.getImagesByDate(date.getFullYear(), date.getMonth() + 1,
				date.getDate(), function(imgraw) {
					if (imgraw != null && imgraw != 'null' && imgraw != '') {
						var index = 0;

						imgraw.forEach(function(element) {

							var slide = {
								image : element.jpg,
								fits : element.fits,
								id : element.id,
								date : element.creationDate,
								rt : element.rt
							};

							if (index == 0) {
								slide.active = true;
							} else {
								slide.active = false;
							}

							scope.addSlide(slide);

							index++;
						});
					}

					scope.timer = timeout(scope.loadCarousel, 500);

				}, function(data, status) {
					console.log('error', data, status);
					scope.loading = false;
				}, function() {
					scope.$emit('unauthorized');
				});
	}
}

function CarouselCtrl($scope, $gloriaAPI, $timeout, $gloriaLocale) {

	$scope.ready = false;

	$gloriaLocale.loadResource('images/lang', 'images', function() {
		$scope.ready = true;
	});

	$scope.myInterval = 1000;
	$scope.slides = [];
	$scope.loading = false;
	$scope.date = null;

	$scope.$watch('date', function() {
		if ($scope.date != null) {
			$scope.loading = true;
			loadImages($scope, $gloriaAPI, $scope.date, $timeout);
		}
	});

	$scope.addSlide = function(slideData) {
		console.log('slide added: ' + slideData);
		$scope.slides.push(slideData);
	};

	$scope.loadCarousel = function() {
		$('#carousel').barousel({
			navType : 2,
			manualCarousel : 1,
			slideDuration : 3000,
			contentResize : 0
		});

		$scope.loading = false;
	};
}
