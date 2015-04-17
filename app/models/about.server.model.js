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
		default: 'Unknown Name',
		trim: true
	},
	email: {
		type: String,
		default: 'Unknown Email',
		trim: true
	},
	picture: {
		type: String,
		default: '',
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
	aboutPodcasts: {
		type: String,
		trim: true
	},
	showLast: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: 'Podcast Manager'
	}
});

mongoose.model('About', AboutSchema);
