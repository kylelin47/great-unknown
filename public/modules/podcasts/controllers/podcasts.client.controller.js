'use strict';
// Podcasts controller
angular.module('podcasts').controller('PodcastsController', ['$scope', 'fileUpload', '$stateParams', '$location', 'Authentication', 'Podcasts', '$sce',
	function($scope, fileUpload, $stateParams, $location, Authentication, Podcasts, $sce) {
		$scope.authentication = Authentication;
		$scope.searchText = '';
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
			console.log(file);
			var uploadUrl = '/uploads/audio/' + Date.now();
			var name = file.name;
			var ext = name.substring(name.lastIndexOf('.'), name.length);
			if (ext === '.mp3' || ext === '.ogg' && ext === '.wav')
			{
				podcast.audioOriginal = name;
				podcast.audio = name.replace(ext, '') + Date.now() + ext;
				fileUpload.uploadFileToUrl(file, uploadUrl);
			}
		};

		$scope.getAudioUrl = function() {
			var podcast = $scope.podcast;
			return $sce.trustAsResourceUrl('uploads/'+podcast.audio);
		};

		$scope.filterList = function(podcast) {
			return podcast.user._id === $scope.authentication.user._id &&
				   (podcast.name.indexOf($scope.searchText) !== -1 ||
					$scope.searchText === '');
		};
	}
]);