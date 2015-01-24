'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Podcast Schema
 */
var PodcastSchema = new Schema({
	name: {
		type: String,
		required: 'Podcast requires a name',
		trim: true
	},
	blog: {
		type: String,
		default: '',
		trim: true
	},
	blurb: {
		type: String,
		default: '',
		trim: true
	},
	audio: {
		type: String,
		default: 'default.mp3'
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

mongoose.model('Podcast', PodcastSchema);