'use strict';

(function() {
    describe('RssController', function() {
        //Initialize global variables
        var scope,
            RssController;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();

            RssController = $controller('RssController', {
                $scope: scope
            });
        }));

        it('should expose the authentication service', function() {
            expect(scope.authentication).toBeTruthy();
        });
        
    });
})();
