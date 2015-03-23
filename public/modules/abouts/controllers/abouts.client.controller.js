'use strict';

// Abouts controller
angular.module('abouts').controller('AboutsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Abouts', 'Podcasts',
	function($scope, $stateParams, $location, Authentication, Abouts, Podcasts) {
		$scope.authentication = Authentication;
		$scope.defaultIcon = '/modules/abouts/img/defaultPoliticalPerson.gif';
		// Create new About
		$scope.create = function() {
			// Create new About object
			var about = new Abouts ({
				name: this.name,
				email: this.email,
				picture: this.picture,
				about: this.aboutMe,
				aboutPodcasts: this.aboutPodcasts,
				showLast: this.showLast
			});

			// Redirect after save
			about.$save(function(response) {
				$location.path('about');

				// Clear form fields
				$scope.name = '';
				$scope.email = '';
				$scope.picture = '';
				$scope.aboutMe = '';
				$scope.aboutPodcasts = '';
				$scope.showLast = false;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Get the About Me page
		$scope.find = function() {
			$scope.abouts = Abouts.query();
			$scope.podcasts = Podcasts.query();
		};
		// Get just the About Me
		$scope.findOne = function() {
			$scope.abouts = Abouts.query();
		};
	}
]);
