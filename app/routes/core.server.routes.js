'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);
    var email = require('../../app/controllers/core.server.controller.js');
    app.route('/core/cus_sendMail').post(email.cus_sendMail);
};
