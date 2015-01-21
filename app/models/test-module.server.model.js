'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Test module Schema
 */
var Person = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Test module name',
		trim: true
	},
    height: {
		type: Number,
		default: 72
	},
    weight: {
		type: Number,
		default: 160
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('TestModule', Person);