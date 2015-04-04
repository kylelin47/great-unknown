'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','$modal', '$log', 'FeedService', 'Abouts', 'Podcasts', '$http',
	function($scope, Authentication, $modal,$log, FeedService, Abouts, Podcasts,$http) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        $scope.defaultIcon = '/modules/abouts/img/defaultPoliticalPerson.gif';

        $scope.data = {
            feedSrc:''
        };

        $scope.find = function() {
            $scope.abouts = Abouts.query();
            $scope.podcasts = Podcasts.query();
        };

        //***************************Modal window for Rss feed********************************//

        $scope.modalOpen = function(size) {


            //set the feedSrc value into factory


            var modalInstance = $modal.open({
                templateUrl: 'modules/core/views/feed.client.view.html',
                controller: function($scope, $modalInstance,items){
                    $scope.items = items;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        //***************************Modal window for Rss feed********************************//
        $scope.cus_sendMail = function() {
            $http.post('/core/cus_sendMail').success(function (response) {
                alert('Successfully subscribe');
            }).error(function (response) {
                console.log(response);
                $scope.error = response.message;
            });
        };
	}
]);
