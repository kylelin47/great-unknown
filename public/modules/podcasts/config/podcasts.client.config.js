'use strict';

// Configuring the Podcasts module
angular.module('podcasts').run(['Menus', '$rootScope', '$anchorScroll',
	function(Menus, $rootScope, $anchorScroll) {
		// Set Your Podcasts menu items
		Menus.addMenuItem('topbar', 'Your Podcasts', 'podcasts', 'dropdown', '/podcasts(/create)?');
		Menus.addSubMenuItem('topbar', 'podcasts', 'Create New Podcast', 'podcasts/create');
		Menus.addSubMenuItem('topbar', 'podcasts', 'List Your Podcasts', 'podcasts');
		$rootScope.$on('$locationChangeSuccess', function() {
                $anchorScroll();
		});
	}
]);
