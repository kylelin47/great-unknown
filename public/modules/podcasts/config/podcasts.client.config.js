'use strict';

// Configuring the Podcasts module
angular.module('podcasts').run(['Menus', '$rootScope', '$anchorScroll', 'ezfb',
	function(Menus, $rootScope, $anchorScroll, ezfb) {
		// Set Your Podcasts menu items
		Menus.addMenuItem('topbar', 'Manage Podcasts', 'podcasts', 'dropdown', '/podcasts(/create)(/blog)?');
		Menus.addSubMenuItem('topbar', 'podcasts', 'Create New Podcast', 'podcasts/create');
		Menus.addSubMenuItem('topbar', 'podcasts', 'Create New Blog', 'podcasts/create/blog');
		Menus.addSubMenuItem('topbar', 'podcasts', 'List Your Podcasts', 'podcasts');
		$rootScope.$on('$locationChangeSuccess', function() {
                $anchorScroll();
		});
		ezfb.init({
			appId: '1544617902479843',
			version: 'v2.0'
		});
	}
]);
