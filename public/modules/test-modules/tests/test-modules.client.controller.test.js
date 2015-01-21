'use strict';

(function() {
	// Test modules Controller Spec
	describe('Test modules Controller Tests', function() {
		// Initialize global variables
		var TestModulesController,
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

			// Initialize the Test modules controller.
			TestModulesController = $controller('TestModulesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Test module object fetched from XHR', inject(function(TestModules) {
			// Create sample Test module using the Test modules service
			var sampleTestModule = new TestModules({
				name: 'New Test module'
			});

			// Create a sample Test modules array that includes the new Test module
			var sampleTestModules = [sampleTestModule];

			// Set GET response
			$httpBackend.expectGET('test-modules').respond(sampleTestModules);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.testModules).toEqualData(sampleTestModules);
		}));

		it('$scope.findOne() should create an array with one Test module object fetched from XHR using a testModuleId URL parameter', inject(function(TestModules) {
			// Define a sample Test module object
			var sampleTestModule = new TestModules({
				name: 'New Test module'
			});

			// Set the URL parameter
			$stateParams.testModuleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/test-modules\/([0-9a-fA-F]{24})$/).respond(sampleTestModule);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.testModule).toEqualData(sampleTestModule);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(TestModules) {
			// Create a sample Test module object
			var sampleTestModulePostData = new TestModules({
				name: 'New Test module'
			});

			// Create a sample Test module response
			var sampleTestModuleResponse = new TestModules({
				_id: '525cf20451979dea2c000001',
				name: 'New Test module'
			});

			// Fixture mock form input values
			scope.name = 'New Test module';

			// Set POST response
			$httpBackend.expectPOST('test-modules', sampleTestModulePostData).respond(sampleTestModuleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Test module was created
			expect($location.path()).toBe('/test-modules/' + sampleTestModuleResponse._id);
		}));

		it('$scope.update() should update a valid Test module', inject(function(TestModules) {
			// Define a sample Test module put data
			var sampleTestModulePutData = new TestModules({
				_id: '525cf20451979dea2c000001',
				name: 'New Test module'
			});

			// Mock Test module in scope
			scope.testModule = sampleTestModulePutData;

			// Set PUT response
			$httpBackend.expectPUT(/test-modules\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/test-modules/' + sampleTestModulePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid testModuleId and remove the Test module from the scope', inject(function(TestModules) {
			// Create new Test module object
			var sampleTestModule = new TestModules({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Test modules array and include the Test module
			scope.testModules = [sampleTestModule];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/test-modules\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTestModule);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.testModules.length).toBe(0);
		}));
	});
}());