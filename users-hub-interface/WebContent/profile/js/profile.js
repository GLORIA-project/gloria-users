function ProfileController($scope, $gloriaAPI, $timeout, $gloriaLocale, Login,
		$filter) {

	$scope.ready = false;

	$scope.initValues = function() {
		$scope.update = {
			fault : {},
			styles : {
				password : {}
			}
		};
	};

	$scope.avatar = {};
	$scope.about = {
		infoLoaded : false,
		ocupations : [ 'student', 'scientist', 'other' ],
		langOcupations : [ 'profile.about.ocupation.student',
				'profile.about.ocupation.scientist',
				'profile.about.ocupation.other' ],
		selectOcupation : function(index) {
			$gloriaAPI.setOcupation($scope.about.ocupations[index], function(
					data) {
				$scope.about.ocupation = $scope.about.langOcupations[index];
			}, function(error) {
			});
		}
	};

	$scope.initValues();

	$scope.warningColor = 'rgb(255, 82, 0)';

	$gloriaLocale.loadResource('profile/lang', 'profile', function() {
		$scope.avatar.adHtml = "<p>"
				+ $filter('highlight')($filter('i18n')('profile.avatar.ad'),
						'Gravatar.com') + "</p>";
		$scope.ready = true;
	});

	$gloriaAPI.getUserInformation(function(data) {
		$scope.about.ocupation = 'profile.about.ocupation.' + data.ocupation;

		$gloriaAPI.getUserKarma(data.name, function(karmaData) {
			if (karmaData != undefined && karmaData != '') {
				$scope.about.karma = karmaData.karma[0];
				console.log(karmaData);				
			} else {
				$scope.about.karma = "?";
			}
			$scope.about.infoLoaded = true;
		}, function(error) {
			$scope.about.infoLoaded = true;
		});

	}, function(error) {
		$scope.about.infoLoaded = true;
	});

	$scope.updatePassword = function() {

		if ($scope.update.password != $scope.update.repPassword) {
			$scope.update.fault.reason = "match";
			$scope.update.styles.password.borderColor = $scope.warningColor;
			$scope.update.fault.on = true;
		} else {
			Login
					.changePassword(
							$scope.update.password,
							function() {
								$scope.update.fault.on = false;
								$scope.update.success = true;
								// $scope.update.timer =
								// $timeout($scope.update.timeout, 2000);
							},
							function(data, status) {

								if (status == 406) {
									$scope.update.styles.password.borderColor = $scope.warningColor;
									if (data.type == "validation") {
										if (data.description == "password") {
											$scope.update.fault.reason = 'inv-password';
										} else {
											$scope.update.fault.reason = 'unknown';
										}
									} else {
										$scope.update.fault.reason = 'unknown';
									}
								} else {
									$scope.update.fault.reason = 'server';
								}

								$scope.update.fault.on = true;
							});
		}
	};

	/*
	 * $scope.update.timeout = function () { $scope.login.disconnect();
	 * $scope.gotoWelcome(); };
	 */

	$scope.$watch('update.password', function() {
		if ($scope.update.fault.on && $scope.update.password != undefined) {
			$scope.update.styles.password.borderColor = undefined;
			$scope.update.fault.on = false;
		}
	});

	$scope.$watch('update.repPassword', function() {
		if ($scope.update.fault.on && $scope.update.repPassword != undefined) {
			$scope.update.styles.password.borderColor = undefined;
			$scope.update.fault.on = false;
		}
	});

	$scope.$on('$destroy', function() {
		// $timeout.cancel($scope.update.timer);
	});
}