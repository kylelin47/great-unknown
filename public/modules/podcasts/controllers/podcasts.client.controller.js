'use strict';
// Podcasts controller

angular.module('podcasts').controller('PodcastsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Podcasts', '$sce', '$http',
	function($scope, $stateParams, $location, Authentication, Podcasts, $sce, $http) {
		$scope.authentication = Authentication;
		$scope.currentPage = parseInt($stateParams.page, 10);
		$scope.defaultPodIcon = 'http://i.imgur.com/f7oBepl.png?1';
		$scope.defaultBlogIcon = 'http://i.imgur.com/rKe21My.png?1';
		$scope.tunnel = 'https://npnghegnjd.localtunnel.me';
		if ($location.path() === '/podcasts/browse/') {
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
				series: this.series
			});
			if ($scope.file && podcast.name) {
				var d = Date.now();
				podcast.audioOriginal = $scope.file.name;
				podcast.audio = d + $scope.file.name;
				$scope.upload(d + $scope.file.name);
			}
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
						$location.path('/podcasts/browse/1');
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
			if ($scope.file && podcast.name) {
				var d = Date.now();
				podcast.audioOriginal = $scope.file.name;
				podcast.audio = d + $scope.file.name;
				$scope.upload(d + $scope.file.name);
			}
			podcast.$update(function() {
				$location.path('podcasts/' + podcast._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.saveByRef = function(podcast) {
			podcast.$update(function() {
				//maybe do something
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.find = function() {
			$scope.podcasts = Podcasts.query();
		};
		// Find a list of Podcasts
		$scope.findPage = function() {
            $http.get('/podcasts/browse/' + $scope.currentPage).
            success(function (data, status) {
                $scope.podcasts = data;
            }).
            error(function (data, status) {
                $scope.err = data;
            });
		};

		// Find existing Podcast
		$scope.findOne = function() {
			if ($location.path() === '/podcasts/browse') {
				$location.path('/podcasts/browse/1');
			} else {
				$scope.podcast = Podcasts.get({ 
					podcastId: $stateParams.podcastId
				});
			}
		};
		$scope.sizeLimit      = 10585760; // 10MB in Bytes
		$scope.uploadProgress = 0;
		$scope.upload = function(filename) {
			/* jshint ignore:start */
			AWS.config.update({ accessKeyId: amazon_credentials.access_key, secretAccessKey: amazon_credentials.secret_key });
			if (amazon_credentials.region) {
				AWS.config.region = amazon_credentials.region;
			} else {
				AWS.config.region = 'us-east-1';
			}
			var bucket = new AWS.S3({ params: { Bucket: amazon_credentials.bucket } });

			if ($scope.file) {
				// Perform File Size Check First
				var fileSize = Math.round(parseInt($scope.file.size));
				if (fileSize > $scope.sizeLimit) {
				  toastr.error('Sorry, your attachment is too big. <br/> Maximum 10 MB','File Too Large');
				  return false;
				}
				// Prepend Unique String To Prevent Overwrites
				var uniqueFileName = filename;

				var params = { Key: uniqueFileName, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };
				toastr.info('A success message will show on completion', 'Attempting File Upload');
				bucket.putObject(params, function(err, data) {
				  if(err) {
					toastr.error(err.message,err.code);
					return false;
				  }
				  else {
					// Upload Successfully Finished
					toastr.success('File Uploaded Successfully.<br />Refresh Page To Listen.', 'Done');

					// Reset The Progress Bar
					setTimeout(function() {
					  $scope.uploadProgress = 0;
					  $scope.$digest();
					}, 4000);
				  }
				})
				.on('httpUploadProgress',function(progress) {
				  $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
				  $scope.$digest();
				});
			} else {
				// No File Selected
				toastr.error('Please select a file to upload');
			}
			/* jshint ignore:end */
		};

		$scope.getAudioUrl = function() {
			var podcast = $scope.podcast;
			if (podcast.audio === 'No file selected') {
				return 'No audio';
			}
			return $sce.trustAsResourceUrl('https://s3.amazonaws.com/podcast-manager/' + podcast.audio);
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
				if ( series_arr.indexOf(podcasts[i].series) === -1 && podcasts[i].series!== '' ) {
					series_arr.push(podcasts[i].series);
					//if series doesnt exist in array, put it in
				}
			}
			return series_arr;
		};
	}
]);
