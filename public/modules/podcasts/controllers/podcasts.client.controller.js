'use strict';
// Podcasts controller

angular.module('podcasts').controller('PodcastsController', ['$scope', 'fileUpload', '$stateParams', '$location', 'Authentication', 'Podcasts', '$sce',
	function($scope, fileUpload, $stateParams, $location, Authentication, Podcasts, $sce) {
		$scope.authentication = Authentication;
		$scope.searchText = '';
		$scope.currentPage = parseInt($stateParams.page, 10);

		if ($location.path() === '/podcasts/browse/')
		{
			$scope.currentPage = 1;
		}
		$scope.perPage = 10;
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
				isBlog: this.isBlog,
				podIcon: this.podIcon,
				series: this.series,
				comments: {},
				posts: {}
			});

			//if empty icon field, use our default
			if ( podcast.podIcon === '' ) {
				podcast.podIcon = 'http://i.imgur.com/f7oBepl.png?1';
			}

			if (typeof $scope.myFile !== 'undefined') {
				var file = $scope.myFile;
				var name = file.name;
				var ext = name.substring(name.lastIndexOf('.'), name.length);
				if (ext === '.mp3' || ext === '.ogg' || ext === '.wav')
				{
					var d = Date.now();
					var uploadUrl = '/uploads/audio/' + d;
					podcast.audioOriginal = name;
					podcast.audio = name.replace(ext, d + ext);
					fileUpload.uploadFileToUrl(file, uploadUrl);
				}
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
						if ($scope.podcasts [i] === podcast) {
							$scope.podcasts.splice(i, 1);
						}
					}
				} else {
					$scope.podcast.$remove(function() {
						$location.path('podcasts');
					});
				}
			}
		};

		// Update existing Podcast
		$scope.update = function() {
			var podcast = $scope.podcast;
			if (typeof $scope.myFile !== 'undefined') {
				$scope.uploadFile();
			}
			podcast.$update(function() {
				$location.path('podcasts/' + podcast._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			//if empty icon field, use our default
			if ( podcast.podIcon === '' ) {
				podcast.podIcon = 'http://i.imgur.com/f7oBepl.png?1';
			}
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
			var name = file.name;
			var ext = name.substring(name.lastIndexOf('.'), name.length);
			if (ext === '.mp3' || ext === '.ogg' || ext === '.wav')
			{
				var d = Date.now();
				var uploadUrl = '/uploads/audio/' + d;
				podcast.audioOriginal = name;
				podcast.audio = name.replace(ext, d + ext);
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

		$scope.getNumber = function(num) {
			return new Array( Math.ceil( num ));
		};

		$scope.defined = function() {
			$scope.podname = document.getElementById('pname');
		};

		$scope.incrementUpvotes = function(i) {
			var comment = $scope.comments[i];
			var splitted = comment.split('|~!');
			var number = parseInt(splitted[3]) + 1;
			var toReplaceComment = splitted[0] + '|~!' + splitted[1] + '|~!' + splitted[2] + '|~!' + number;
			$scope.podcast.comments[i] = toReplaceComment;
		};

		$scope.createComment = function() {
			var podcast = $scope.podcast;
			var newComment = '';
			var d = Date.now();
			newComment += $scope.authentication.user.displayName + '|~!' + d + '|~!' + $scope.comText + '|~!' + 0; 
			podcast.comments.push(newComment);
			podcast.$update(function() {
				$location.path('podcasts/' + podcast._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.deleteComment = function(n) {
			var podcast = $scope.podcast;
			podcast.comments.splice(n, 1);
			podcast.$update(function() {
				$location.path('podcasts/' + podcast._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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