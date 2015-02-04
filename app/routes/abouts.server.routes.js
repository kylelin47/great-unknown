'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var abouts = require('../../app/controllers/abouts.server.controller');

	// Abouts Routes
	app.route('/about')
		.get(abouts.list)
		.post(users.requiresLogin, abouts.hasAuthorization, abouts.create);
};
