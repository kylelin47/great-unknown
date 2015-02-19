'use strict';

angular.module('core').controller('RssController', ['$scope', 'Authentication','FeedService','Podcasts', '$stateParams','$modal', '$log',
    function($scope, Authentication, FeedService,Podcasts,$stateParams,$modal,$log) {
        $scope.authentication = Authentication;
        //$scope.ace = ['a','b'];

        //recheving data from mongo
        $scope.find = function() {
            $scope.podcasts = Podcasts.query();
        };


        $scope.feedSrc = $stateParams.Feed;

        $scope.loadFeed=function(e){
            FeedService.parseFeed($scope.feedSrc).then(function(res){
                $scope.feeds= res.data.responseData.feed.entries;
            });
        };


        //***************************Modal window for Rss feed********************************//
        this.items = $scope.feeds;

        $scope.open = function (size) {

            $scope.modalInstance = $modal.open({
                templateUrl: '',
                controller: 'RssController',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            $scope.modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        //***************************Modal window for Rss feed********************************//
    }


]);
