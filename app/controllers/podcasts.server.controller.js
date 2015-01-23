'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Podcast = mongoose.model('Podcast'),
	_ = require('lodash');

/**
 * Create a Podcast
 */
exports.create = function(req, res) {
	var podcast = new Podcast(req.body);
	podcast.user = req.user;

	podcast.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
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

	podcast.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(podcast);
		}
	});
};

/**
 * Delete an Podcast
 */
exports.delete = function(req, res) {
	var podcast = req.podcast ;

	podcast.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
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
	if (req.podcast.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
