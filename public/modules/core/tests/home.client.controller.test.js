'use strict';

(function() {
	describe('HomeController', function() {
		//Initialize global variables
		var scope,
			HomeController,
            myFactory;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function($controller, $rootScope) {
			scope = $rootScope.$new();

			HomeController = $controller('HomeController', {
				$scope: scope
			});


		}));

		it('should expose the authentication service', function() {
			expect(scope.authentication).toBeTruthy();
		});

        it('should see the result', function(){
            scope.feedSrc = 'http://rss.cnn.com/rss/cnn_topstories.rss';

        });
	});
})();
