function loadRandomImages(scope, $gloriaAPI, count, timeout) {
	scope.slides = [];

	console.log("loading images");

	$gloriaAPI.getRandomImages(count, function(imgraw) {
		if (imgraw != null && imgraw != 'null' && imgraw != '') {
			var index = 0;

			imgraw.forEach(function(element) {

				var slide = {
					image : element.jpg,
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

function loadUserRandomImages(scope, $gloriaAPI, count, timeout) {
	scope.slides = [];

	console.log("loading images");

	$gloriaAPI.getMyRandomImages(count, function(imgraw) {
		if (imgraw != null && imgraw != 'null' && imgraw != '') {
			var index = 0;

			imgraw.forEach(function(element) {

				var slide = {
					image : element.jpg,
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

function CommunityImagesController($scope, $gloriaAPI, $timeout) {
	$scope.myInterval = 1000;
	$scope.slides = [];
	$scope.loading = false;
	$scope.focused = false;
	$scope.addSlide = function(slideData) {
		$scope.slides.push(slideData);
	};
	$scope.loadCarousel = function() {
		$('#comm_carousel').barousel({
			navType : 2,
			manualCarousel : 0,
			slideDuration : 3000,
			contentResize : 0
		});

		$scope.loading = false;
	};

	$scope.loading = true;
	loadRandomImages($scope, $gloriaAPI, 10, $timeout);
}

function UserImagesController($scope, $gloriaAPI, $timeout) {
	$scope.myInterval = 1000;
	$scope.slides = [];
	$scope.loading = false;
	$scope.focused = false;
	$scope.addSlide = function(slideData) {
		$scope.slides.push(slideData);
	};
	$scope.loadCarousel = function() {
		$('#user_carousel').barousel({
			navType : 2,
			manualCarousel : 0,
			slideDuration : 3000,
			contentResize : 0
		});

		$scope.loading = false;
	};

	$scope.loading = true;
	loadUserRandomImages($scope, $gloriaAPI, 10, $timeout);
}


function HomePageController($scope, $gloriaAPI, $timeout, $gloriaLocale) {
	
	$scope.ready = false;
	
	$gloriaLocale.loadResource('main/lang', 'home', function() {
		$scope.ready = true;
	});
}