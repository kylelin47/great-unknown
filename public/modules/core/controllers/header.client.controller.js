'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Abouts', 'Authentication', 'Menus', '$location',
	function($scope, Abouts, Authentication, Menus, $location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.abouts = Abouts.query();
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.isRoute = function(route) {
			return ($location.path()).substring(0, route.length) === route;
		};

		$scope.isPath = function(path) {
			return ($location.path() === path);
		};
	}
]);
