'use strict';
// Podcasts controller

angular.module('podcasts').controller('PodcastsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Podcasts', '$sce',
	function($scope, $stateParams, $location, Authentication, Podcasts, $sce) {
		$scope.authentication = Authentication;
		$scope.currentPage = parseInt($stateParams.page, 10);
		$scope.defaultPodIcon = 'http://i.imgur.com/f7oBepl.png?1';
		$scope.defaultBlogIcon = 'http://i.imgur.com/rKe21My.png?1';
		if ($location.path() === '/podcasts/browse/')
		{
			$scope.currentPage = 1;
		}
		$scope.perPage = 6;
		// Create new Podcast
		$scope.create = function() {
			// Create new Podcast object
			var podcast = new Podcasts ({
				name: this.name,
				blog: this.blog,
				blurb: this.blurb,
				audio: this.audio,
				audioOriginal: this.audioOriginal,
				category: this.category,
				isBlog: false,
				podIcon: this.podIcon,
				series: this.series,
				comments: {},
				posts: {}
			});

			//if empty icon field, use our default
			if ( podcast.podIcon === '' || typeof podcast.podIcon === 'undefined' ) {
				podcast.podIcon = $scope.defaultPodIcon;
			}
			// Redirect after save
			podcast.$save(function(response) {
				$location.path('podcasts/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.blog = '';
				$scope.blurb = '';
				$scope.audio = '';
				$scope.audioOriginal = '';
				$scope.category = '';
				$scope.series = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.createBlog = function() {
			// Create new Podcast object
			var podcast = new Podcasts ({
				name: this.name,
				blog: this.blog,
				blurb: this.blurb,
				category: this.category,
				isBlog: true,
				podIcon: this.podIcon,
				series: this.series
			});

			//if empty icon field, use our default
			if ( podcast.podIcon === '' || typeof podcast.podIcon === 'undefined' ) {
				podcast.podIcon = $scope.defaultBlogIcon;
			}
			// Redirect after save
			podcast.$save(function(response) {
				$location.path('podcasts/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.blog = '';
				$scope.blurb = '';
				$scope.category = '';
				$scope.series = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Remove existing Podcast
		$scope.remove = function(podcast) {
			var r = confirm('Are you sure you want to delete this podcast? Deletion is permanent.');
			if ( r === true ) {
				if ( podcast ) { 
					podcast.$remove();

					for (var i in $scope.podcasts) {
						if ($scope.podcasts[i]._id === podcast._id) {
							$scope.podcasts.splice(i, 1);
						}
					}
				} else {
					$scope.podcast.$remove(function() {
						if ($location.path().substring(0,10)  === '/podcasts/')
							$location.path('/podcasts/browse/');
						else
							$location.path('podcasts');
					});
				}
			}
		};
		
		$scope.removeByID = function(ID) {
			var tempPodcast = new Podcasts({
				_id: ID
			});
			$scope.remove(tempPodcast);
		};

		// Update existing Podcast
		$scope.update = function() {
			var podcast = $scope.podcast;
			if ( podcast.podIcon === '' || typeof podcast.podIcon === 'undefined' ) {
				if ( podcast.isBlog ) podcast.podIcon = $scope.defaultBlogIcon;
				else podcast.podIcon =  $scope.defaultPodIcon;
			}
			podcast.$update(function() {
				$location.path('podcasts/' + podcast._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Podcasts
		$scope.find = function() {
			$scope.podcasts = Podcasts.query();
		};

		// Find existing Podcast
		$scope.findOne = function() {
			if ($location.path() === '/podcasts/browse')
			{
				$location.path('/podcasts/browse/1');
			}
			else
			{
				$scope.podcast = Podcasts.get({ 
					podcastId: $stateParams.podcastId
				});
			}
		};

		$scope.uploadFile = function(){
		};
			

		$scope.getAudioUrl = function() {
			var podcast = $scope.podcast;
			return $sce.trustAsResourceUrl('uploads/' + podcast.audio);
		};
		
		$scope.incrementTotalSeconds = function() {
			$scope.podcast.totalSecondsListened++;
			$scope.update();
			return $scope.podcast.totalSecondsListened;
		};
		
		$scope.getAvgSeconds = function(){
			if($scope.podcast.listens === 0){
				return 0;
			}
			return Math.floor($scope.podcast.totalSecondsListened / $scope.podcast.listens);
		};
		
		$scope.tmpListen = true;
		
		$scope.updateListens = function() {
			if($scope.tmpListen){
				$scope.podcast.listens++;
				$scope.update();
				$scope.tmpListen = false;
			}
		};
		
		$scope.getListen = function(){
			return $scope.podcast.listens;
		};

		$scope.filterList = function(podcast) {
			return podcast.user._id === $scope.authentication.user._id &&
				   (podcast.name.indexOf($scope.searchText) !== -1 ||
					$scope.searchText === '');
		};

		$scope.getNumber = function(num) {
			return new Array( Math.ceil( num ));
		};

		$scope.defined = function() {
			$scope.podname = document.getElementById('pname');
		};

		$scope.getSeriesArr = function(podcasts) {
			var series_arr = [];
			series_arr.push('');
			for (var i = 0; i < podcasts.length; i++) {
				if ( series_arr.indexOf(podcasts[i].series) === -1 && podcasts[i].series!=='' ) {
					series_arr.push(podcasts[i].series);
					//if series doesnt exist in array, put it in
				}
			}
			return series_arr;
		};

	}
]);