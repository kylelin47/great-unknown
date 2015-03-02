'use strict';

angular.module('core').factory('FeedService',['$http',function($http){

    var myObj = {
        feedSrc: ''
    };

    return {
        getFeed: function(data){
            myObj = data;
        },
        setFeed: function(){
            return myObj;
        },
        parseFeed : function(url){
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    };
}]);
