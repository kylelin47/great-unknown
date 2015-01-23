'use strict';

// Podcasts controller
angular.module('podcasts').controller('PodcastsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Podcasts',
	function($scope, $stateParams, $location, Authentication, Podcasts) {
		$scope.authentication = Authentication;
		$scope.counter = 0;
		// Create new Podcast
		$scope.create = function() {
			// Create new Podcast object
			var podcast = new Podcasts ({
				name: this.name
			});

			// Redirect after save
			podcast.$save(function(response) {
				$location.path('podcasts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Podcast
		$scope.remove = function(podcast) {
			if ( podcast ) { 
				podcast.$remove();

				for (var i in $scope.podcasts) {
					if ($scope.podcasts [i] === podcast) {
						$scope.podcasts.splice(i, 1);
					}
				}
			} else {
				$scope.podcast.$remove(function() {
					$location.path('podcasts');
				});
			}
		};

		// Update existing Podcast
		$scope.update = function() {
			var podcast = $scope.podcast;

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
			$scope.podcast = Podcasts.get({ 
				podcastId: $stateParams.podcastId
			});
		};
		
		$scope.audioSelected = function() {
			var el = document.getElementById('what');
			el.innerHTML = 'hi';
			$scope.counter += 1;
		};
	}
]);