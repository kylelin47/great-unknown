'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var podcasts = require('../../app/controllers/podcasts.server.controller');

	app.route('/podcasts')
		.get(podcasts.list)
		.post(users.requiresLogin, podcasts.hasAuthorization, podcasts.create);

	app.route('/podcasts/:podcastId')
		.get(podcasts.read)
		.put(podcasts.update)
		.delete(users.requiresLogin, podcasts.hasAuthorization, podcasts.delete);

	// Finish by binding the Podcast middleware
	app.param('podcastId', podcasts.podcastByID);
};
