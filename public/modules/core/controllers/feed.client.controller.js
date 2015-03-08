'use strict';

angular.module('core').controller('RssController', ['$scope', 'Authentication','FeedService','Podcasts', '$stateParams','$modal', '$log',
    function($scope, Authentication, FeedService,Podcasts,$stateParams,$modal,$log) {
        $scope.authentication = Authentication;
        //$scope.ace = ['a','b'];

        //recheving data from mongo
        $scope.find = function() {
            $scope.podcasts = Podcasts.query();
        };


        $scope.feedSrc = FeedService.setFeed().feedSrc;

        $scope.loadButonText="Rss_read";

        $scope.loadFeed=function(e){
            FeedService.parseFeed($scope.feedSrc).then(function(res){
                $scope.loadButonText= res.data.responseData.feed.title;
                $scope.feeds= res.data.responseData.feed.entries;
            });
        };

        //***************************Modal window for Rss feed********************************//
        $scope.items = ['item1', 'item2', 'item3'];

        //***************************Modal window for Rss feed********************************//

    }
]);


