'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var testModules = require('../../app/controllers/test-modules.server.controller');

	// Test modules Routes
	app.route('/test-modules')
		.get(testModules.list)
		.post(users.requiresLogin, testModules.create);

	app.route('/test-modules/:testModuleId')
		.get(testModules.read)
		.put(users.requiresLogin, testModules.hasAuthorization, testModules.update)
		.delete(users.requiresLogin, testModules.hasAuthorization, testModules.delete);

	// Finish by binding the Test module middleware
	app.param('testModuleId', testModules.testModuleByID);
};
