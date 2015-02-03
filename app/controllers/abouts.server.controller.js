'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	About = mongoose.model('About'),
	_ = require('lodash');

/**
 * Create a About
 */
exports.create = function(req, res) {
	var about = new About(req.body);
	about.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(about);
		}
	});
};

/**
 * Show the current About
 */
exports.read = function(req, res) {
	res.jsonp(req.about);
};
/**
 * List of Abouts
 */
exports.list = function(req, res) { 
	About.find().sort('-created').limit(1).exec(function(err, abouts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(abouts);
		}
	});
};
/**
 * About middleware
 */
exports.aboutByID = function(req, res, next, id) { 
	About.findById(id).populate('user', 'displayName').exec(function(err, about) {
		if (err) return next(err);
		if (! about) return next(new Error('Failed to load About ' + id));
		req.about = about ;
		next();
	});
};

/**
 * About authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.about.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
