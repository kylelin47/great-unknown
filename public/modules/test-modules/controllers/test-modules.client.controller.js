'use strict';

// Test modules controller
angular.module('test-modules').controller('TestModulesController', ['$scope', '$stateParams', '$location', 'Authentication', 'TestModules',
	function($scope, $stateParams, $location, Authentication, TestModules) {
		$scope.authentication = Authentication;

		// Create new Test module
		$scope.create = function() {
			// Create new Test module object
			var testModule = new TestModules ({
				name: this.name
			});

			// Redirect after save
			testModule.$save(function(response) {
				$location.path('test-modules/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Test module
		$scope.remove = function(testModule) {
			if ( testModule ) { 
				testModule.$remove();

				for (var i in $scope.testModules) {
					if ($scope.testModules [i] === testModule) {
						$scope.testModules.splice(i, 1);
					}
				}
			} else {
				$scope.testModule.$remove(function() {
					$location.path('test-modules');
				});
			}
		};

		// Update existing Test module
		$scope.update = function() {
			var testModule = $scope.testModule;

			testModule.$update(function() {
				$location.path('test-modules/' + testModule._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Test modules
		$scope.find = function() {
			$scope.testModules = TestModules.query();
		};

		// Find existing Test module
		$scope.findOne = function() {
			$scope.testModule = TestModules.get({ 
				testModuleId: $stateParams.testModuleId
			});
		};
	}
]);