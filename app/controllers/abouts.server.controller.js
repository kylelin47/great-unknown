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
 * List of Abouts
 */
exports.list = function(req, res) {
	//About.remove().exec(); //to clear abouts
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
 * About authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.username !== 'admin') {
		return res.status(403).send('User is not authorized');
	}
	next();
};
