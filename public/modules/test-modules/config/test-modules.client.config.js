'use strict';

// Configuring the Articles module
angular.module('test-modules').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('testMenu', 'Test modules', 'test-modules', 'dropdown', '/test-modules(/create)?');
		Menus.addSubMenuItem('testMenu', 'test-modules', 'List Test modules', 'test-modules');
		Menus.addSubMenuItem('testMenu', 'test-modules', 'New Test module', 'test-modules/create');
	}
]);