'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Podcast = mongoose.model('Podcast');

/**
 * Globals
 */
var user, podcast, podcast2;

/**
 * Unit tests
 */
describe('Podcast Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'admin',
			password: 'password'
		});

		user.save(function() { 
			podcast = new Podcast({
				name: 'Podcast Name',
				user: user
			});
			podcast2 = new Podcast({
				name: 'Second Podcast Name',
				user: user
			});
			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return podcast.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to save multiple without problems', function(done) {
			podcast.save();
			return podcast2.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to save multiple of the same name without problems', function(done) {
			podcast.save();
			podcast2.name = 'Podcast Name';
			return podcast2.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to associate users with podcasts', function(done) {
			should.exist(podcast.user);
			return done();
		});

		it('should be able to show an error when try to save without name', function(done) { 
			podcast.name = '';

			return podcast.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Podcast.remove().exec();
		User.remove().exec();

		done();
	});
});
