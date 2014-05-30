'use strict';

function loadPendingReservations(scope, api) {

	scope.pendingRetrieved = false;
	scope.pending = [];
	scope.loading = true;

	return api.getOnlinePendingReservations(function(data) {
		data.forEach(function(element) {
			scope.pending.push({
				experiment : element.experiment,
				reservationId : element.reservationId,
				begin : element.timeSlot.begin,
				end : element.timeSlot.end,
				telescopes : element.telescopes,
				user : element.user
			});
		});

		scope.npages = Math.ceil(scope.pending.length / 10);
		scope.pagesArray = new Array(scope.npages);
		scope.pendingRetrieved = true;
		scope.loading = false;

		toolbox.scrollTo('table2');
	}, function(data) {
		console.log('error', data, status);
		scope.loading = false;
		scope.pendingRetrieved = true;
		scope.loading = false;
	}, function() {
		scope.$emit('unauthorized');
	});
}

function formatPendingDateRow(d, filter) {
	var date = new Date(d.value);
	if (date !== undefined) {
		var dateStr = filter('date')(date, 'yyyy-MM-dd HH:mm');
		date = filter('utc')(date);
		dateStr += ' (' + filter('date')(date, 'HH:mm') + ' UT)';

		d.value = dateStr;
	}
}

function buildUIPendingTable(scope, elementName, paginationName, filter) {
	YUI()
			.use(
					'aui-datatable',
					'aui-pagination',
					function(Y) {

						scope.table = new Y.DataTable(
								{
									columns : [
											{
												key : 'reservationId',
												sortable : true,
												label : '#'
											},
											{
												key : 'user',
												sortable : true,
												label : filter('i18n')(
														'pending.table.user')
											},
											{
												key : 'experiment',
												label : filter('i18n')
														(
																'pending.table.experiment')
											},
											{
												key : 'begin',
												label : filter('i18n')(
														'pending.table.begin'),
												sortable : 'true',
												formatter : function(o) {
													var now = new Date();
													var date = new Date(o.value);
													if (date != undefined) {
														if (now >= date) {
															o.rowClass = 'rowBackBold';
														} else {
															o.rowClass = 'rowBack';
														}
														formatPendingDateRow(o,
																filter);
													}
												}

											},
											{
												key : 'end',
												label : filter('i18n')(
														'pending.table.end'),
												sortable : 'true',
												formatter : function(o) {
													formatPendingDateRow(o,
															filter);
												}
											},
											{
												key : 'telescopes',
												label : filter('i18n')
														(
																'pending.table.telescopes')
											} ],
									recordset : scope.pending.slice(0, 10)
								});

						scope.pagination = new Y.Pagination(
								{
									contentBox : '#pagination2 .aui-pagination-content',
									page : 1,
									total : scope.npages,
									on : {
										changeRequest : function(event) {

											if (event.state.page <= scope.npages) {

												var fromIndex = ((event.state.page - 1) * 10);
												var toIndex = ((event.state.page - 1) * 10) + 10;

												scope.table.set('recordset',
														scope.pending.slice(
																fromIndex,
																toIndex));

												scope.showTelescope = false;
												scope.goButton.show = false;
												scope.cancelButton.show = false;
												scope.refreshButton.show = false;
												scope.errorButton.show = false;
												try {
													scope.$apply();
												} catch (e) {
												}
											}
										}
									}
								});

						scope.table
								.delegate(
										'click',
										function(e) {
											var target = e.currentTarget;
											try {
												var record = this.getRecord(
														target).toJSON();

												if (record != null) {
													scope.selected = record;
													scope.selected.index = target._node.rowIndex;
													scope.selected.width = target._node.clientWidth;
													scope.selected.height = target._node.clientHeight;
													scope.selected.left = (e._currentTarget.clientWidth - scope.selected.width) / 2;
													scope.$apply();
												}
											} catch (error) {
											}

										}, 'tr', scope.table);

						scope.table.render('#table2');
						scope.pagination.render('#pagination2');
						scope.tableInit = true;

					});
}

function PendingReservationsListCtrl($gloriaAPI, $scope, $timeout, $location,
		$window, $gloriaLocale, $filter) {

	$scope.pendingReady = false;

	toolbox.scrollTo('header');

	$gloriaLocale.loadResource('pending/lang', 'pending', function() {
		$scope.pendingReady = true;
	});

	$scope.pending = [];
	$scope.loading = true;
	$scope.pendingRetrieved = false;
	$scope.tableInit = false;
	$scope.selected = null;
	$scope.tableStyle = {};
	$scope.telescopeStyle = {
		border : '1px solid rgba(192, 192, 192, 0.13)',
		borderRadius : '2px'
	};
	$scope.mountStyle = {};
	$scope.weatherStyle = {};
	$scope.domeStyle = {};
	$scope.showTelescope = false;
	$scope.tableBuilt = false;
	$scope.goButton = {
		style : {}
	};
	$scope.cancelButton = {
		style : {}
	};
	$scope.refreshButton = {
		style : {}
	};
	$scope.errorButton = {
		style : {}
	};

	$scope.$watch('pagesArray', function() {
		if (!$scope.tableBuilt && $scope.pending.length > 0) {
			buildUIPendingTable($scope, 'table', 'pagination', $filter);
			$scope.tableBuilt = true;
		}
	});

	$scope.$watch('selected', function() {
		if ($scope.selected != null) {
			$scope.reservationSelected = true;
			$scope.goButton.show = false;
			$scope.cancelButton.show = false;
			$scope.refreshButton.show = false;
			$scope.errorButton.show = false;

			$timeout.cancel($scope.timer);
			var top = ($scope.selected.height * $scope.selected.index) + 3;
			var cancelLeft = $scope.selected.left - 48;
			var goLeft = cancelLeft + $scope.selected.width + 56;

			$scope.goButton.style.top = top + 'px';
			$scope.goButton.style.left = goLeft + 'px';

			$scope.cancelButton.style.top = top + 'px';
			$scope.cancelButton.style.left = cancelLeft + 'px';

			$scope.errorButton.style = $scope.cancelButton.style;
			$scope.refreshButton.style = $scope.goButton.style;

			$scope.refreshInfo();
			$scope.loadTelescopeState();
		}
	});

	$scope.showRTStatus = function(left) {
		$scope.telescopeStyle.top = $scope.cancelButton.style.top;
		if (left) {
			var left = $scope.selected.left - 205;
			$scope.telescopeStyle.left = left + 'px';
		} else {
			var left = $scope.selected.left + $scope.selected.width + 56;
			$scope.telescopeStyle.left = left + 'px';
		}
		$scope.showTelescope = true;
	};

	$scope.initTelescopeState = function() {
		$scope.rtStatus = {
			mount : {},
			dome : {},
			weather : {}
		};
	};

	$scope.loadTelescopeState = function() {
		$scope.initTelescopeState();

		$gloriaAPI.getWeatherState($scope.selected.telescopes, function(data) {
			var alarm = data.alarm;

			if (alarm) {
				$scope.weatherStyle.color = 'rgb(218, 79, 73)';
				$scope.rtStatus.weather.state = 'ALARM';
			} else {
				$scope.weatherStyle.color = 'silver';
				$scope.rtStatus.weather.state = 'CLEAR';
			}
		}, function(error) {
			$scope.rtStatus.weather.state = 'ERROR';
			$scope.weatherStyle.color = 'rgb(218, 79, 73)';
		});

		$gloriaAPI.getDomeState($scope.selected.telescopes, function(data) {
			$scope.rtStatus.dome = data;
			if (data.state === 'UNDEFINED') {
				$scope.domeStyle.color = 'rgb(218, 79, 73)';
			} else {
				$scope.domeStyle.color = 'silver';
			}
		}, function(error) {
			$scope.domeStyle.color = 'rgb(218, 79, 73)';
			$scope.rtStatus.dome.state = 'ERROR';
		});

		$gloriaAPI.getMountState($scope.selected.telescopes, function(data) {
			if (data.state === 'UNDEFINED') {
				data.state = 'UNKNOWN';
			}
			$scope.mountStyle.color = 'silver';
			$scope.rtStatus.mount = data;
		}, function(error) {
			$scope.mountStyle.color = 'rgb(218, 79, 73)';
			$scope.rtStatus.mount.state = 'ERROR';
		});
	};

	$scope.refreshInfo = function() {
		$gloriaAPI.getReservationInformation($scope.selected.reservationId,
				function(info) {
					if (info.status == 'READY') {
						$scope.goButton.show = true;
						$scope.cancelButton.show = false;
						$scope.refreshButton.show = false;
						$scope.errorButton.show = false;
						$scope.showRTStatus(false);
					} else if (info.status == 'SCHEDULED') {
						var beginDate = new Date($scope.selected.begin);

						if (beginDate < new Date()) {
							$scope.timer = $timeout($scope.refreshInfo, 1000);
							$scope.refreshButton.show = true;
							$scope.showRTStatus(false);
						} else {
							$scope.cancelButton.show = true;
							$scope.showRTStatus(true);
						}
						$scope.goButton.show = false;
						$scope.errorButton.show = false;
					} else {
						$scope.timer = $timeout($scope.refreshInfo, 5000);
						$scope.goButton.show = false;
						$scope.cancelButton.show = false;
						$scope.refreshButton.show = false;
						$scope.errorButton.show = true;
						$scope.showRTStatus(true);
					}

				}, function(error) {
					$scope.goButton.show = false;
					$scope.cancelButton.show = false;
					$scope.refreshButton.show = false;
					$scope.errorButton.show = true;
				});
	};

	$scope.$watch('tableInit', function() {
		if ($scope.tableInit) {
			if ($scope.table != undefined) {
				$scope.table.set('recordset', $scope.pending.slice(0, 10));
				$scope.pagination.set('total', $scope.npages);
				$scope.table.render('#table2');
				$scope.pagination.render('#pagination2');
				$scope.loading = false;
			}
		}
	});

	$scope.go = function() {
		var url = $window.location.protocol + '//' + $window.location.host
				+ '/' + $scope.selected.experiment.toLowerCase()
				+ '/#/view?rid=' + $scope.selected.reservationId;
		$window.location.href = url;
	};

	$scope.updateAfterCancel = function() {
		$scope.table.set('recordset', $scope.pending.slice(0, 10));
		$scope.pagination.set('total', $scope.npages);
		$scope.goButton.show = false;
		$scope.cancelButton.show = false;
		$scope.refreshButton.show = false;
		$scope.errorButton.show = false;
	};

	$scope.cancel = function() {
		$scope.showTelescope = false;

		$gloriaAPI.cancelReservation($scope.selected.reservationId, function() {

			loadPendingReservations($scope, $gloriaAPI).then(function() {
				$scope.updateAfterCancel();
			}, function() {
				$scope.updateAfterCancel();
			});

		}, function(error) {

		}, function() {
			scope.$emit('unauthorized');
		});
	};

	loadPendingReservations($scope, $gloriaAPI);

	$scope.$on('$destroy', function() {
		$scope.table = null;
		$scope.pagination = null;
		$timeout.cancel($scope.timer);
	});

	$scope.initTelescopeState();
}
