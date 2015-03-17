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

			// Create a sample Abouts array that includes the new About
			var sampleAbouts = [sampleAbout];

			// Set GET response
			$httpBackend.expectGET('about').respond(sampleAbouts);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.abouts).toEqualData(sampleAbouts);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and relocate URL', inject(function(Abouts) {
			// Create a sample object
			var sampleAboutPostData = new Abouts({
				picture: ''
			});

			// Create a sample response
			var sampleAboutResponse = new Abouts({
				_id: '525cf20451979dea2c000001',
				picture: ''
			});

			// Fixture mock form input values
			scope.picture = '';

			// Set POST response
			$httpBackend.expectPOST('about', sampleAboutPostData).respond(sampleAboutResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Podcast was created
			expect($location.path()).toBe('/about');
		}));
	});
}());
