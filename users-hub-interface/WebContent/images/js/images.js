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

function AlbumFormCtrl($gloriaAPI, $scope, $timeout) {
	
	$scope.telescopes = [];
	
	
	$scope.experiments = [
	   'Solar Experiment',
	   'Night Experiment',
	   'Scheduler'
	];
	
	$scope.experiments_selection = [];
	
	$scope.toogleExperimentSelection = function(exp) {
		
		var experimentIndex = $scope.experiments_selection.indexOf(exp);
		
		if (experimentIndex > -1){
			$scope.experiments_selection.splice(experimentIndex,1);
		}  else {
			$scope.experiments_selection.push(exp);
		}
	};
	
	$scope.telescopes_selection = [];
	
	$scope.toogleTelescopeSelection = function(tel) {
		
		var telescopeIndex = $scope.telescopes_selection.indexOf(tel);
		
		if (telescopeIndex > -1){
			$scope.telescopes_selection.splice(telescopeIndex, 1);
		} else {
			$scope.telescopes_selection.push(tel);
		}
		
	};
	
	$scope.today = function() {
		$scope.dt_begin = new Date();
		$scope.dt_end = new Date();
	};
	$scope.today();
	
	$scope.showWeeks = true;
	$scope.toggleWeeks = function() {
		$scope.showWeeks = !$scope.showWeeks;
	};

	$scope.clear = function() {
		$scope.dt_begin = null;
		$scope.dt_end = null;
	};
	
	$scope.current = new Date();
	
	$scope.disabled = function(date, mode) {
		return false;
	};

	$scope.toggleMin = function() {
		$scope.minDate = ($scope.minDate) ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function($event,opened) {
		 $event.preventDefault();
		 $event.stopPropagation();

		 $scope[opened] = true;
	};

	$scope.dateOptions = {
		'year-format' : "'yy'",
		'starting-day' : 1
	};
	
	
	$scope.search = function(){
		
		console.log("***************** Experiments ****************");
		console.log($scope.experiments_selection);
		
		console.log("***************** Target *********************");
		if ($scope.target_type=="name"){
			console.log("Name Selected");
			console.log("Name:"+$scope.target_name);
		} else if ($scope.target_type=="coordinates"){
			console.log("Coordinates Selected");
			console.log("RA:"+$scope.ra_coordinate);
			console.log("DEC:"+$scope.dec_coordinate);
			console.log("RADIUS:"+$scope.radius);
		} else {
			console.log("No target selected");
		}
		
		console.log("***************** Telescopes *********************");
		console.log($scope.telescopes_selection);
	};
	
	$scope.telescopeTimerFunction = function(){
		$gloriaAPI.getTelescopes(function (success){
			//$scope.telescopes = success;
			$scope.loading_telescopes = false;
			var item;
			for (var i=0;i<success.length;i++){
				if (i<success.length/2){
					item = {name:success[i],col:1};	
				} else {
					item = {name:success[i],col:2};
				}
				
				$scope.telescopes.push(item);
				
			}
		}, function (error){
			$scope.telescopeTimer = $timeout($scope.telescopeTimerFunction, 1000);
		});
		
	};
	
	$timeout($scope.telescopeTimerFunction, 1000);
	

}
