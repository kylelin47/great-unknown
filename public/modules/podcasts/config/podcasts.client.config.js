'use strict';

// Configuring the Podcasts module
angular.module('podcasts').run(['Menus', '$rootScope', '$anchorScroll', 'ezfb',
	function(Menus, $rootScope, $anchorScroll, ezfb) {
		// Set Your Podcasts menu items
		Menus.addMenuItem('topbar', 'Manage Podcast', 'podcasts', 'dropdown', '/podcasts(/create)(/blog)?');
		Menus.addSubMenuItem('topbar', 'podcasts', 'Create New Episode', 'podcasts/create');
		Menus.addSubMenuItem('topbar', 'podcasts', 'Create New Blog Post', 'podcasts/create/blog');
		Menus.addSubMenuItem('topbar', 'podcasts', 'List and Edit Posts', 'podcasts');
		$rootScope.$on('$locationChangeSuccess', function() {
                $anchorScroll();
		});
		ezfb.init({
			appId: '1544617902479843',
			version: 'v2.0'
		});
	}
]);
