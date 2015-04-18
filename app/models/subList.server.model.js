/*
* Contain non user email list*/


'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * About Schema
 */
var subListSchema = new Schema({
    name: {
        type: String,
        default: 'Unknown Name',
        trim: true
    },
    email: {
        type: String,
        default: 'Unknown Email',
        trim: true
    }
});

mongoose.model('SubList', subListSchema);
