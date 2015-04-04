'use strict';

angular.module('core').factory('FeedService',['$http',function($http){

    var myObj = {
        feedSrc: 'http://rss.cnn.com/rss/cnn_topstories.rss'
    };

    return {
        getFeed: function(data){
            if(data.feed !== null){
                myObj = data;
            }
        },
        setFeed: function(){
            return myObj;
        },
        parseFeed : function(url){
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    };
}]);
