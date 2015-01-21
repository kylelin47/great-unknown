'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	TestModule = mongoose.model('TestModule'),
	_ = require('lodash');

/**
 * Create a Test module
 */
exports.create = function(req, res) {
	var testModule = new TestModule(req.body);
	testModule.user = req.user;

	testModule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testModule);
		}
	});
};

/**
 * Show the current Test module
 */
exports.read = function(req, res) {
	res.jsonp(req.testModule);
};

/**
 * Update a Test module
 */
exports.update = function(req, res) {
	var testModule = req.testModule ;

	testModule = _.extend(testModule , req.body);

	testModule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testModule);
		}
	});
};

/**
 * Delete an Test module
 */
exports.delete = function(req, res) {
	var testModule = req.testModule ;

	testModule.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testModule);
		}
	});
};

/**
 * List of Test modules
 */
exports.list = function(req, res) { 
	TestModule.find().sort('-created').populate('user', 'displayName').exec(function(err, testModules) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(testModules);
		}
	});
};

/**
 * Test module middleware
 */
exports.testModuleByID = function(req, res, next, id) { 
	TestModule.findById(id).populate('user', 'displayName').exec(function(err, testModule) {
		if (err) return next(err);
		if (! testModule) return next(new Error('Failed to load Test module ' + id));
		req.testModule = testModule ;
		next();
	});
};

/**
 * Test module authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.testModule.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
