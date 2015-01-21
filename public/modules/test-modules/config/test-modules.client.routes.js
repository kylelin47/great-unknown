'use strict';

//Setting up route
angular.module('test-modules').config(['$stateProvider',
	function($stateProvider) {
		// Test modules state routing
		$stateProvider.
		state('listTestModules', {
			url: '/test-modules',
			templateUrl: 'modules/test-modules/views/list-test-modules.client.view.html'
		}).
		state('createTestModule', {
			url: '/test-modules/create',
			templateUrl: 'modules/test-modules/views/create-test-module.client.view.html'
		}).
		state('viewTestModule', {
			url: '/test-modules/:testModuleId',
			templateUrl: 'modules/test-modules/views/view-test-module.client.view.html'
		}).
		state('editTestModule', {
			url: '/test-modules/:testModuleId/edit',
			templateUrl: 'modules/test-modules/views/edit-test-module.client.view.html'
		});
	}
]);