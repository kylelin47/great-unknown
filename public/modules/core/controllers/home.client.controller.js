'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','$modal', '$log', 'FeedService', 'Abouts', 'Podcasts', '$http', 'SubLists','$location',
	function($scope, Authentication, $modal,$log, FeedService, Abouts, Podcasts, $http, SubLists,$location) {
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
        //************************** Open for form ************************************//
         $scope.openForm = function(size){
            var modalInstance = $modal.open({
                templateUrl: 'modules/core/views/getEmail.client.view.html',
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


        $scope.subEmail_store = function(){
           //console.log('enterSubEmail, AM I HERE?');
            var subList = new SubLists ({
                name: this.subEmailName,
                email:this.subEmail
            });
            subList.$save(function(response) {
                $location.path('/#!/');
                // Clear form fields
                $scope.subEmailName = '';
                $scope.subEmail = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            $scope.cancel();
        };

        $scope.subscribe = function() {
                if ($scope.authentication.user) {
                    $scope.authentication.user.is_subscribe = true;
                }
                /* jshint ignore:start */
                else {
                    $scope.openForm('lg');
                    return;
                }
                $http.post('/core/cus_sendMail').success(function (response) {
                    toastr.success(response);
                }).error(function (response) {
                    toastr.options.closeButton = true;
                    toastr.options.progressBar = true;
                    toastr.error(response);
                    toastr.options.closeButton = false;
                    toastr.options.progressBar = false;
                });
                /* jshint ignore:end */
            };

	}
]);
