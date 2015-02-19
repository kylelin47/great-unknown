'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','$modal','$log',
	function($scope, Authentication, $modal, $log) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


        //***************************Modal window for Rss feed********************************//

        $scope.modalOpen = function(size) {

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
	}
]);
