'use strict';

angular.module('core').controller('RssController', ['$scope', 'Authentication','FeedService','Podcasts', '$stateParams','$modal', '$log',
    function($scope, Authentication, FeedService,Podcasts,$stateParams,$modal,$log) {
        $scope.authentication = Authentication;
        //$scope.ace = ['a','b'];



        $scope.feedSrc = FeedService.setFeed().feedSrc;

        $scope.loadButonText= 'Rss_feed load';

        $scope.loadFeed=function(e){
            var tmp = 'This is my feedSrc:' + $scope.feedSrc;
            //console.log(tmp);
            FeedService.parseFeed($scope.feedSrc).then(function(res){
                $scope.feeds= res.data.responseData.feed.entries;
                $scope.FeedTitle= res.data.responseData.feed.title;
                $scope.FeedTitleLink = res.data.responseData.feed.link;
            });
        };

        //***************************Modal window for Rss feed********************************//
        $scope.items = ['item1', 'item2', 'item3'];

        //***************************Modal window for Rss feed********************************//

    }
]);


