'use strict';

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

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
	var done = 0;
	var valid_types = ['mp3', 'ogg', 'wav'];
	var audioMulter = 
	  multer({
		  dest: './public/uploads/',
		  rename: function (fieldname, filename) {
			return filename;
			//return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
		  },
		  onFileUploadStart: function (file) {
			if (!containsObject(file.extension, valid_types)) {
				done = 2;
				return false;
			}
			console.log(file.originalname + ' is starting ...');
		  },
		  onFileUploadComplete: function (file) {
			console.log(file.fieldname + ' uploaded to  ' + file.path);
			done=1;
		  },
		  onFileUploadData: function (file, data) {
			console.log(data.length + ' of ' + file.fieldname + ' arrived');
		  },
		  limits: {
			  fileSize: 1000000000
		  }
	  });
	var fs = require('fs');
	app.post('/uploads/audio/:date', audioMulter, function(req,res){
		console.log(req.params.date);
		console.log(req.body);
		var ext = '.' + req.files.file.extension;
		var newName = req.files.file.path.replace(ext, '') + req.params.date + ext;
		fs.rename(req.files.file.path, newName, function(err) {
			if ( err ) console.log('ERROR: ' + err);
			fs.unlink(req.files.file.path, function (err) {
			  if (err) console.log('Fixed ERROR: ' + err);
			});
		});
		console.log(req.files);
		if (done === 2) {
			res.send('Invalid file type');
		}
	});
	// Finish by binding the Podcast middleware
	app.param('podcastId', podcasts.podcastByID);
};
