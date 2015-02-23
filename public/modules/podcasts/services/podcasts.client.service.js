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
angular.module('podcasts').filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
