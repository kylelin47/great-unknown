'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var podcasts = require('../../app/controllers/podcasts.server.controller');

	// Podcasts Routes
	app.route('/podcasts')
		.get(podcasts.list)
		.post(users.requiresLogin, podcasts.create);

	app.route('/podcasts/browse')
		.get(podcasts.list)
		.post(users.requiresLogin, podcasts.create);

	app.route('/podcasts/:podcastId')
		.get(podcasts.read)
		.put(users.requiresLogin, podcasts.hasAuthorization, podcasts.update)
		.delete(users.requiresLogin, podcasts.hasAuthorization, podcasts.delete);
	// Initialize multer
	var multer  = require('multer');
	var done = false;
	app.use(multer({
	  dest: './public/uploads/',
	  rename: function (fieldname, filename) {
		return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
	  },
	  onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...');
	  },
	  onFileUploadComplete: function (file) {
	    console.log(file.fieldname + ' uploaded to  ' + file.path);
	    done=true;
	  },
	  limits: {
		  fileSize: 1000000000
	  }
	}));
	app.post('/upload/audio',function(req,res){
		console.log(req.body);
		console.log(req.files);
		if (done) {
			res.send('upload complete. file name: ' + req.files.audio.name);
		}
	});
	// Finish by binding the Podcast middleware
	app.param('podcastId', podcasts.podcastByID);
};
