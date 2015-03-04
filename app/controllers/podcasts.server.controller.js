'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	fs = require('fs'),
	errorHandler = require('./errors.server.controller'),
	Podcast = mongoose.model('Podcast'),
	path = require('path'),
	_ = require('lodash');

function updateFeed() {
	var path_to_feed = path.join(__dirname, '../..', 'public', 'feed.xml');
	var xml_text = '<?xml version = "1.0" encoding = "utf-8"?>\n' +
				   '<rss version = "2.0">\n' +
				   '\t<channel>\n';
	Podcast.find().sort('-created').populate('user', 'displayName').exec(function(err, podcasts) {
		if (err) {
			console.log('Error');
		} else {
			for (var index in podcasts) {
				var podcast = podcasts[index];
				xml_text +=
					'\t\t<item>\n' +
			        '\t\t<title>' + podcast.name + ', ' + podcast.category + '</title>\n' +
			        '\t\t<description>' + podcast.blurb + '</description>\n' +
			        '\t\t<language>en-us</language>\n' +
			        '\t\t<link>' + 'https://lbcqrcfwju.localtunnel.me/#!/podcasts/' + podcast._id + '</link>\n' +
			        '\t\t<image>\n' +
			            '\t\t\t<title>My Icon</title>\n' +
			            '\t\t\t<src>' + podcast.podIcon + '</src>\n' +
			            '\t\t\t<width>40</width>\n' +
			            '\t\t\t<height>40</height>\n' +
			        '\t\t</image>\n' +
			        '\t\t</item>\n';
			}
			xml_text += '\t</channel>\n</rss>';
			fs.writeFile(path_to_feed, xml_text, function (err) {
				if (err) throw err;
				console.log('Feed updated');
			});
		}
	});
}
/**
 * Create a Podcast
 */
exports.create = function(req, res) {
	var podcast = new Podcast(req.body);
	podcast.user = req.user;
	podcast.blurb = podcast.blurb.substring(0, 120);
	if (podcast.blurb === '') {
		//No need to check for out of bounds, js is cool
		podcast.blurb = podcast.blog.substring(0, 120);
		if (podcast.blog.length > 120) podcast.blurb += ' . . .';
	}
	//podcast.normalized = podcast.name.toLowerCase();
	podcast.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			updateFeed();
			res.jsonp(podcast);
		}
	});
};

/**
 * Show the current Podcast
 */
exports.read = function(req, res) {
	res.jsonp(req.podcast);
};

/**
 * Update a Podcast
 */
exports.update = function(req, res) {
	var podcast = req.podcast ;

	podcast = _.extend(podcast , req.body);
	podcast.blurb = podcast.blurb.substring(0, 120);
	//podcast.normalized = podcast.name.toLowerCase();

	podcast.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			updateFeed();
			res.jsonp(podcast);
		}
	});
};
/**
 * Delete a Podcast
 */
exports.delete = function(req, res) {
	var podcast = req.podcast ;

	podcast.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			updateFeed();
			res.jsonp(podcast);
		}
	});
};

/**
 * List of Podcasts
 */
exports.list = function(req, res) {
	Podcast.find().sort('-created').populate('user', 'displayName').exec(function(err, podcasts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(podcasts);
		}
	});
};

/**
 * Podcast middleware
 */
exports.podcastByID = function(req, res, next, id) { 
	Podcast.findById(id).populate('user', 'displayName').exec(function(err, podcast) {
		if (err) return next(err);
		if (! podcast) return next(new Error('Failed to load Podcast ' + id));
		req.podcast = podcast ;
		next();
	});
};

/**
 * Podcast authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.username !== 'admin') {
		return res.status(403).send('User is not authorized');
	}
	next();
};
