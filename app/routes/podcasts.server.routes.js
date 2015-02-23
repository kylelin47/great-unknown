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

	app.route('/podcasts')
		.get(podcasts.list)
		.post(users.requiresLogin, podcasts.hasAuthorization, podcasts.create);

	app.route('/podcasts/browse/:page')
		.get(podcasts.list);

	app.route('/podcasts/:podcastId')
		.get(podcasts.read)
		.put(users.requiresLogin, podcasts.hasAuthorization, podcasts.update)
		.delete(users.requiresLogin, podcasts.hasAuthorization, podcasts.delete);

	var fs = require('fs');
	app.post('/uploads/audio/:date', function(req,res){
		console.log(req.params.date);
		console.log(req.body);
		var ext = '.' + req.files.file.extension;
		var newName = req.files.file.path.replace(ext, req.params.date + ext);
		fs.exists(newName, function(exists) {
			if (exists) {
				fs.unlink(req.files.file.path, function (err) {
				  if (err) console.log('No overwrite: ' + err);
				});
			}
			else {
				fs.rename(req.files.file.path, newName, function(err) {
					if ( err ) console.log('ERROR: ' + err);
				});
			}
		});
		console.log(req.files);
	});
	// Finish by binding the Podcast middleware
	app.param('podcastId', podcasts.podcastByID);
};
