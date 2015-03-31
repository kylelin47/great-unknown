'use strict';

(function() {
	// Podcasts Controller Spec
	describe('Podcasts Controller Tests', function() {
		// Initialize global variables
		var PodcastsController,
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

			// Initialize the Podcasts controller.
			PodcastsController = $controller('PodcastsController', {
				$scope: scope
			});
			//Say Yes to all Windows
			spyOn(window, 'confirm').and.callFake(function () {// jshint ignore:line
				 return true;
			});

		}));

		it('$scope.find() should create an array with at least one Podcast object fetched from XHR', inject(function(Podcasts) {
			// Create sample Podcast using the Podcasts service
			var samplePodcast = new Podcasts({
				name: 'New Podcast'
			});

			// Create a sample Podcasts array that includes the new Podcast
			var samplePodcasts = [samplePodcast];

			// Set GET response
			$httpBackend.expectGET('podcasts').respond(samplePodcasts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.podcasts).toEqualData(samplePodcasts);
		}));

		it('$scope.findOne() should create an array with one Podcast object fetched from XHR using a podcastId URL parameter', inject(function(Podcasts) {
			// Define a sample Podcast object
			var samplePodcast = new Podcasts({
				name: 'New Podcast'
			});

			// Set the URL parameter
			$stateParams.podcastId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/podcasts\/([0-9a-fA-F]{24})$/).respond(samplePodcast);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.podcast).toEqualData(samplePodcast);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcastPostData = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1'
			});

			// Create a sample Podcast response
			var samplePodcastResponse = new Podcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1'
			});

			// Fixture mock form input values
			scope.name = 'New Podcast';

			// Set POST response
			$httpBackend.expectPOST('podcasts', samplePodcastPostData).respond(samplePodcastResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Podcast was created
			expect($location.path()).toBe('/podcasts/' + samplePodcastResponse._id);
		}));

		it('$scope.create() should set isBlog to false and supply a default podcast icon', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcastPostData = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1'
			});

			// Create a sample Podcast response
			var samplePodcastResponse = new Podcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1'
			});

			// Fixture mock form input values
			scope.name = 'New Podcast';

			// Set POST response
			$httpBackend.expectPOST('podcasts', samplePodcastPostData).respond(samplePodcastResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();
		}));

		it('$scope.create() should set ignore user-set isBlog values and supply a default podcast icon', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcastPostData = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1'
			});

			// Create a sample Podcast response
			var samplePodcastResponse = new Podcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1'
			});

			// Fixture mock form input values
			scope.name = 'New Podcast';
			scope.isBlog = true;

			// Set POST response
			$httpBackend.expectPOST('podcasts', samplePodcastPostData).respond(samplePodcastResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();
		}));

		it('$scope.createBlog() should set isBlog to true and supply a default blog icon', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcastPostData = new Podcasts({
				name: 'New Podcast',
				isBlog: true,
				podIcon: 'http://i.imgur.com/rKe21My.png?1'
			});

			// Create a sample Podcast response
			var samplePodcastResponse = new Podcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Podcast',
				isBlog: true,
				podIcon: 'http://i.imgur.com/rKe21My.png?1'
			});

			// Fixture mock form input values
			scope.name = 'New Podcast';

			// Set POST response
			$httpBackend.expectPOST('podcasts', samplePodcastPostData).respond(samplePodcastResponse);

			// Run controller functionality
			scope.createBlog();
			$httpBackend.flush();
		}));

		it('$scope.createBlog() should ignore user-set isBlog values and supply a default blog icon', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcastPostData = new Podcasts({
				name: 'New Podcast',
				isBlog: true,
				podIcon: 'http://i.imgur.com/rKe21My.png?1'
			});

			// Create a sample Podcast response
			var samplePodcastResponse = new Podcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Podcast',
				isBlog: true,
				podIcon: 'http://i.imgur.com/rKe21My.png?1'
			});

			// Fixture mock form input values
			scope.name = 'New Podcast';
			scope.isBlog = false;

			// Set POST response
			$httpBackend.expectPOST('podcasts', samplePodcastPostData).respond(samplePodcastResponse);

			// Run controller functionality
			scope.createBlog();
			$httpBackend.flush();
		}));

		it('$scope.getSeriesArr should have sane defaults when no podcasts exist', inject(function(Podcasts) {
			var podcastsArray = [];
			var series = scope.getSeriesArr(podcastsArray);
			expect(series.length).toBe(1);
			expect(series[0]).toBe('');
		}));

		it('$scope.getSeriesArr should have sane defaults when no series exist', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcast = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				series: ''
			});
			var samplePodcast2 = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				series: ''
			});
			var podcastsArray = [samplePodcast, samplePodcast2];
			var series = scope.getSeriesArr(podcastsArray);
			expect(series.length).toBe(1);
			expect(series[0]).toBe('');
		}));

		it('$scope.getSeriesArr should get series from podcasts', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcast = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				series: 'Tests'
			});
			var samplePodcast2 = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				series: 'Second Tests'
			});
			var podcastsArray = [samplePodcast, samplePodcast2];
			var series = scope.getSeriesArr(podcastsArray);
			expect(series.length).toBe(3);
			expect(series[0]).toBe('');
			expect(series[1]).toBe('Tests');
			expect(series[2]).toBe('Second Tests');
		}));

		it('$scope.getSeriesArr should get series from podcasts when some are null', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcast = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				series: 'Tests'
			});
			var samplePodcast2 = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				series: 'Second Tests'
			});
			var samplePodcast3 = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				series: ''
			});
			var podcastsArray = [samplePodcast, samplePodcast2];
			var series = scope.getSeriesArr(podcastsArray);
			expect(series.length).toBe(3);
			expect(series[0]).toBe('');
			expect(series[1]).toBe('Tests');
			expect(series[2]).toBe('Second Tests');
		}));

		it('$scope.getCategoryArr should have default when no podcasts exist', inject(function(Podcasts) {
			var podcastsArray = [];
			var categories = scope.getCategoryArr(podcastsArray);
			expect(categories.length).toBe(1);
			expect(categories[0]).toBe('');
		}));

		it('$scope.getCategoryArr should have default when no categories exist', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcast = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				category: ''
			});
			var samplePodcast2 = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				category: ''
			});
			var podcastsArray = [samplePodcast, samplePodcast2];
			var categories = scope.getCategoryArr(podcastsArray);
			expect(categories.length).toBe(1);
			expect(categories[0]).toBe('');
		}));

		it('$scope.getCategoryArr should get categories from podcasts', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcast = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				category: 'Tests'
			});
			var samplePodcast2 = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				category: 'Tests Two'
			});
			var podcastsArray = [samplePodcast, samplePodcast2];
			var categories = scope.getCategoryArr(podcastsArray);
			expect(categories.length).toBe(3);
			expect(categories[0]).toBe('');
			expect(categories[1]).toBe('Tests');
			expect(categories[2]).toBe('Tests Two');
		}));

		it('$scope.getCategoryArr should sort categories from podcasts', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcast = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				category: 'B'
			});
			var samplePodcast2 = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				category: 'A'
			});
			var podcastsArray = [samplePodcast, samplePodcast2];
			var categories = scope.getCategoryArr(podcastsArray);
			expect(categories.length).toBe(3);
			expect(categories[0]).toBe('');
			expect(categories[1]).toBe('A');
			expect(categories[2]).toBe('B');
		}));

		it('$scope.getCategoryArr should get categories from podcasts when some are null', inject(function(Podcasts) {
			// Create a sample Podcast object
			var samplePodcast = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				category: 'Tests'
			});
			var samplePodcast2 = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				category: 'Tests Two'
			});
			var samplePodcast3 = new Podcasts({
				name: 'New Podcast',
				isBlog: false,
				podIcon: 'http://i.imgur.com/f7oBepl.png?1',
				series: ''
			});
			var podcastsArray = [samplePodcast, samplePodcast2];
			var categories = scope.getCategoryArr(podcastsArray);
			expect(categories.length).toBe(3);
			expect(categories[0]).toBe('');
			expect(categories[1]).toBe('Tests');
			expect(categories[2]).toBe('Tests Two');
		}));

		it('$scope.update() should update a valid Podcast', inject(function(Podcasts) {
			// Define a sample Podcast put data
			var samplePodcastPutData = new Podcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Podcast'
			});

			// Mock Podcast in scope
			scope.podcast = samplePodcastPutData;

			// Set PUT response
			$httpBackend.expectPUT(/podcasts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/podcasts/' + samplePodcastPutData._id);
		}));

		it('$scope.saveByRef() should update a valid Podcast', inject(function(Podcasts) {
			// Define a sample Podcast put data
			var samplePodcastPutData = new Podcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Podcast'
			});

			// Mock Podcast in scope
			scope.podcast = samplePodcastPutData;

			// Set PUT response
			$httpBackend.expectPUT(/podcasts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.saveByRef(samplePodcastPutData);
			$httpBackend.flush();
		}));

		it('$scope.remove() should send a DELETE request with a valid podcastId and remove the Podcast from the scope', inject(function(Podcasts) {
			// Create new Podcast object
			var samplePodcast = new Podcasts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Podcasts array and include the Podcast
			scope.podcasts = [samplePodcast];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/podcasts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePodcast);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.podcasts.length).toBe(0);
		}));

		it('$scope.removeByID() should send a DELETE request with a valid podcastId and remove the Podcast from the scope', inject(function(Podcasts) {
			// Create new Podcast object
			var samplePodcast = new Podcasts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Podcasts array and include the Podcast
			scope.podcasts = [samplePodcast];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/podcasts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.removeByID(samplePodcast._id);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.podcasts.length).toBe(0);
		}));

		it('$scope.getAudioUrl() should return a trusted resource', inject(function(Podcasts) {
			// Define a sample Podcast put data
			var samplePodcastPutData = new Podcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Podcast',
				audio: '12312312.mp3'
			});

			// Mock Podcast in scope
			scope.podcast = samplePodcastPutData;

			// Run controller functionality
			scope.getAudioUrl();
		}));

		it('$scope.getVideoUrl() should return a trusted resource', inject(function(Podcasts) {
			// Define a sample Podcast put data
			var samplePodcastPutData = new Podcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Podcast',
				video: '12312312.mp4'
			});

			// Mock Podcast in scope
			scope.podcast = samplePodcastPutData;

			// Run controller functionality
			scope.getVideoUrl();
		}));

		it('$scope.getNumber(n) should return an array of size n', inject(function(Podcasts) {
			var n = 10;
			expect(scope.getNumber(n).length).toBe(n);
		}));

		it('$scope.getNumber(n) should round up', inject(function(Podcasts) {
			var n = 9.2;
			expect(scope.getNumber(n).length).toBe(10);
		}));

	});
}());
