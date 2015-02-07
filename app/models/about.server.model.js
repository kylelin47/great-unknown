'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * About Schema
 */
var AboutSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill About name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	about: {
		type: String,
		trim: true
	},
	showLast: {
		type: Boolean,
		default: false
	}
});

mongoose.model('About', AboutSchema);