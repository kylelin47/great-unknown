'use strict';

(function() {
	// Edit about Controller Spec
	describe('Edit about Controller Tests', function() {
		// Initialize global variables
		var AboutsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Edit about controller.
			AboutsController = $controller('AboutsController', {
				$scope: scope
			});
		}));
		it('$scope.findOne() should create an array with one About object fetched from XHR', inject(function(Abouts) {
			// Create sample About using the Abouts service
			var sampleAbout = new Abouts({
				name: 'New About'
			});

			// Create a sample Podcasts array that includes the new Podcast
			var sampleAbouts = [sampleAbout];

			// Set GET response
			$httpBackend.expectGET('about').respond(sampleAbouts);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.abouts).toEqualData(sampleAbouts);
		}));
	});
}());