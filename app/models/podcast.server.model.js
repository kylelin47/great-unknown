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
	},/* possibly lower-case normalized name for sorting*/
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
	audioOriginal: {
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
	},
    category: {
        type: String,
        default: 'Misc'
    }
});

mongoose.model('Podcast', PodcastSchema);