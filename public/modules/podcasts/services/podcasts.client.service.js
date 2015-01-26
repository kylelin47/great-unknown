'use strict';

//Podcasts service used to communicate Podcasts REST endpoints
angular.module('podcasts').factory('Podcasts', ['$resource',
	function($resource) {
		return $resource('podcasts/:podcastId', { podcastId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
angular.module('podcasts').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
				var ext = this.value.match(/\.(.+)$/)[1];
				switch(ext)
				{
					case 'mp3':
					case 'ogg':
					case 'wav':
						break;
					default:
						alert('Invalid file extension');
						this.value='';
				}
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
angular.module('podcasts').service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data) {
			/*
			Podcasts.update( 
				{ _id: id}, //Query
				{ audio: data } //Set
			);
			*/
        })
        .error(function() {
        });
    };
}]);