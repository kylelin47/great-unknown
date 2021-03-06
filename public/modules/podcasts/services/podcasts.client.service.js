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
/*
angular.module('podcasts').factory('progress', function() {
  var progress = 0;
  var progressService = {};
  progressService.update = function(val) {
    progress = val;
  };
  progressService.getProgress = function() {
    return progress;
  };
  return progressService;
});

angular.module('podcasts').factory('videoProgress', function() {
  var progress = 0;
  var progressService = {};
  progressService.update = function(val) {
    progress = val;
  };
  progressService.getProgress = function() {
    return progress;
  };
  return progressService;
});
*/
// From endorama @ https://gist.github.com/endorama/7369006
angular.module('podcasts').directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) {
        if (attr.type==='text/javascript-lazy') {
          var code = elem.text();
		  /*jslint evil: true */
          var f = new Function(code);
          f();
        }
	  }
	};
});

angular.module('podcasts').directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
        if (this.value !== '') {
          var ext = this.value.substring(this.value.lastIndexOf('.'), this.value.length);
          switch(ext)
          {
           case '.mp3':
           case '.ogg':
           case '.wav':
             break;
           default:
             alert('Invalid file extension. Accepted are .mp3, .ogg, and .wav');
             this.value='';
          }
        }
        var files = event.target.files;
        var file = files[0];
        scope.file = file;
        scope.$parent.file = file;
        scope.$apply();
      });
    }
  };
});

angular.module('podcasts').directive('videoFile', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
        if (this.value !== '') {
          var ext = this.value.substring(this.value.lastIndexOf('.'), this.value.length);
          switch(ext)
          {
           case '.mp4':
           case '.ogg':
           case '.webm':
             break;
           default:
             alert('Invalid file extension. Accepted are .mp4, .ogg, and .webm');
             this.value='';
          }
        }
        var files = event.target.files;
        var file = files[0];
        scope.videoFile = file;
        scope.$parent.videoFile = file;
        scope.$apply();
      });
    }
  };
});

angular.module('podcasts').filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
