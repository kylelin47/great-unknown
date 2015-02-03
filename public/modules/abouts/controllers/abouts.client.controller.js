'use strict';

// Abouts controller
angular.module('abouts').controller('AboutsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Abouts', 'Podcasts',
	function($scope, $stateParams, $location, Authentication, Abouts, Podcasts) {
		$scope.authentication = Authentication;

		// Create new About
		$scope.create = function() {
			// Create new About object
			var about = new Abouts ({
				name: this.name,
				about: this.about
			});

			// Redirect after save
			about.$save(function(response) {
				$location.path('about');

				// Clear form fields
				$scope.name = '';
				$scope.about = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Get the About Me page
		$scope.find = function() {
			$scope.abouts = Abouts.query();
			$scope.podcasts = Podcasts.query();
		};

	}
]);