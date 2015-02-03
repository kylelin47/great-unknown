'use strict';

//Setting up route
angular.module('abouts').config(['$stateProvider',
	function($stateProvider) {
		// Abouts state routing
		$stateProvider.
		state('editAbout', {
			url: '/about/edit',
			templateUrl: 'modules/abouts/views/edit.about.client.view.html'
		}).
		state('about', {
			url: '/about',
			templateUrl: 'modules/abouts/views/about.client.view.html'
		});
	}
]);