'use strict';

//Test modules service used to communicate Test modules REST endpoints
angular.module('test-modules').factory('TestModules', ['$resource',
	function($resource) {
		return $resource('test-modules/:testModuleId', { testModuleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);