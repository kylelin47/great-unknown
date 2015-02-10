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
		required: 'Name is a required field',
		trim: true
	},/* possibly lower-case normalized name for sorting with dashes replacing spaces*/
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
		default: 'No file selected'
	},
	audioOriginal: {
		type: String,
		default: 'No file selected'
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
    },
	isBlog: {
		type: Boolean,
		default: false
	},
	podIcon: {
		type: String,
		//we can pick better default if we want
		default: 'http://i.imgur.com/LUsrAfg.gif'
	},
	comments: [{
		comAuthor: String,
		comTime: Date,
		comText: String
	}]
});
mongoose.model('Podcast', PodcastSchema);
