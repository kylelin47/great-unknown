'use strict';

//Setting up route
angular.module('podcasts').config(['$stateProvider',
	function($stateProvider) {
		// Podcasts state routing
		$stateProvider.
		state('browsePodcast', {
			url: '/podcasts/browse/:page',
			templateUrl: 'modules/podcasts/views/browse-podcast.client.view.html'
		}).
		state('listPodcasts', {
			url: '/podcasts',
			templateUrl: 'modules/podcasts/views/list-podcasts.client.view.html'
		}).
		state('createPodcast', {
			url: '/podcasts/create',
			templateUrl: 'modules/podcasts/views/create-podcast.client.view.html'
		}).
		state('createBlog', {
			url: '/podcasts/create/blog',
			templateUrl: 'modules/podcasts/views/create-blog.client.view.html'
		}).
		state('createSeries', {
			url: '/podcasts/create/series',
			templateUrl: 'modules/podcasts/views/create-series.client.view.html'
		}).
		state('viewPodcast', {
			url: '/podcasts/:podcastId',
			templateUrl: 'modules/podcasts/views/view-podcast.client.view.html'
		}).
		state('editPodcast', {
			url: '/podcasts/:podcastId/edit',
			templateUrl: 'modules/podcasts/views/edit-podcast.client.view.html'
		});
	}
]);
