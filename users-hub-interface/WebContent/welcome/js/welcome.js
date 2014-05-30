function WelcomeUserController($scope, $location, Login, $gloriaView, $timeout,
		$gloriaLocale) {

	$scope.ready = false;
	
	$gloriaLocale.loadResource('welcome/lang', 'welcome', function() {
		$scope.ready = true;
	});

	$scope.initValues = function() {
		$scope.register = {
			fault : {},
			styles : {
				email : {},
				password : {},
				alias : {}
			}
		};

		$scope.reset = {
			email : null,
			fault : {},
			styles : {
				email : {}
			}
		};
	};

	$scope.initValues();

	$scope.warningColor = 'rgb(255, 82, 0)';

	$scope.newUser = function() {

		if ($scope.register.password != $scope.register.repPassword) {
			$scope.register.fault.reason = 'match';
			$scope.register.styles.password.borderColor = $scope.warningColor;
			$scope.register.fault.on = true;
		} else {
			Login
					.registerUser(
							$scope.register.alias,
							$scope.register.email,
							$scope.register.password,
							function() {
								$scope.register.alias = null;
								$scope.register.email = null;
								$scope.register.password = null;
								$scope.register.success = true;
							},
							function(data, status) {
								console.log(data);

								if (status == 406) {
									if (data.type == "validation") {
										if (data.description == "email") {
											$scope.register.fault.reason = 'inv-email';
											$scope.register.styles.email.borderColor = $scope.warningColor;
										} else {
											$scope.register.fault.reason = 'password';
											$scope.register.styles.password.borderColor = $scope.warningColor;
										}
									} else if (data.description.reason != undefined
											&& data.description.reason
													.indexOf("exists") >= 0) {

										$scope.register.fault.reason = data.description.id;
										if ($scope.register.fault.reason == 'alias') {
											$scope.register.styles.alias.borderColor = $scope.warningColor;
										} else {
											$scope.register.styles.email.borderColor = $scope.warningColor;
										}
									} else {
										$scope.register.fault.reason = 'unknown';
									}
								} else {
									$scope.register.fault.reason = 'server';
								}

								$scope.register.fault.on = true;
							});
		}
	};

	$scope.resetUser = function() {
		Login
				.resetPassword(
						$scope.reset.email,
						function() {
							$scope.reset.fault.on = false;
							$scope.reset.success = true;
						},
						function(data, status) {

							if (status == 406) {
								if (data.type == "validation") {
									if (data.description == "email") {
										$scope.reset.fault.reason = 'inv-email';
										$scope.reset.styles.email.borderColor = $scope.warningColor;
									} else {
										$scope.reset.fault.reason = 'unknown';
									}
								} else {
									$scope.reset.fault.reason = 'unknown';
								}
							} else {
								$scope.reset.fault.reason = 'server';
							}

							$scope.reset.fault.on = true;
						});
	};

	$scope.$on('$destroy', function() {

	});

	$scope.$watch('register.password', function() {
		if ($scope.register.fault.on && $scope.register.password != undefined) {
			$scope.register.styles.password.borderColor = undefined;
			$scope.register.fault.on = false;
		}
	});

	$scope.$watch('register.repPassword', function() {
		if ($scope.register.fault.on
				&& $scope.register.repPassword != undefined) {
			$scope.register.styles.password.borderColor = undefined;
			$scope.register.fault.on = false;
		}
	});

	$scope.$watch('register.email', function() {
		if ($scope.register.fault.on && $scope.register.email != undefined) {
			$scope.register.styles.email.borderColor = undefined;
			$scope.register.fault.on = false;
		}
	});

	$scope.$watch('register.alias', function() {
		if ($scope.register.fault.on && $scope.register.alias != undefined) {
			$scope.register.styles.alias.borderColor = undefined;
			$scope.register.fault.on = false;
		}
	});

	$scope.$watch('reset.email', function() {
		if ($scope.reset.fault.on && $scope.reset.email != undefined) {
			$scope.reset.styles.email.borderColor = undefined;
			$scope.reset.fault.on = false;
		}
	});

	$scope.$watch('option', function() {
		if ($scope.option != undefined) {
			$scope.initValues();
		}
	});

	$scope.$on('$destroy', function() {

	});
}