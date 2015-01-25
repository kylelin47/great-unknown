'use strict';
// Podcasts controller
angular.module('podcasts').controller('PodcastsController', ['$scope', 'fileUpload', '$stateParams', '$location', 'Authentication', 'Podcasts',
	function($scope, fileUpload, $stateParams, $location, Authentication, Podcasts) {
		$scope.authentication = Authentication;
		// Create new Podcast
		$scope.create = function() {
			// Create new Podcast object
			var podcast = new Podcasts ({
				name: this.name,
				blog: this.blog,
				blurb: this.blurb
			});

			// Redirect after save
			podcast.$save(function(response) {
				$location.path('podcasts/' + response._id + '/edit');

				// Clear form fields
				$scope.name = '';
				$scope.blog = '';
				$scope.blurb = '';
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
		$scope.uploadFile = function(){
			var podcast = $scope.podcast;
			var file = $scope.myFile;
			var uploadUrl = '/upload/audio';
			podcast.audio = 'default.mp3';
			fileUpload.uploadFileToUrl(file, uploadUrl);
			podcast.audio = fileUpload.fileName;
		};
	}
]);