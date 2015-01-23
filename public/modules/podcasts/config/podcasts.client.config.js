'use strict';

// Configuring the Podcasts module
angular.module('podcasts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Podcasts', 'podcasts', 'dropdown', '/podcasts(/create)?');
		Menus.addSubMenuItem('topbar', 'podcasts', 'List Your Podcasts', 'podcasts');
		Menus.addSubMenuItem('topbar', 'podcasts', 'Create New Podcast', 'podcasts/create');
	}
]);
