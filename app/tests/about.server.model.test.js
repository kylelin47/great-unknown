'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    About = mongoose.model('About');

/**
 * Globals
 */
var about, about2;

/**
 * Unit tests
 */
describe('About Model Unit Tests:', function() {
    beforeEach(function(done) {
        about = new About({
            name: 'About Name'
        });
        about2 = new About({
            name: 'Second About Name'
        });
        done();
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return about.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to save multiple without problems', function(done) {
            about.save();
            return about2.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to save multiple of the same name without problems', function(done) {
            about.save();
            about2.name = 'Podcast Name';
            return about2.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to save without a name', function(done) { 
            about.name = '';

            return about.save(function(err) {
                should.not.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) { 
        About.remove().exec();

        done();
    });
});
