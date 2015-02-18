'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Podcast = mongoose.model('Podcast'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, podcast;

/**
 * Podcast routes tests
 */
describe('Podcast CRUD tests for non-admins', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'average_joe',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Podcast
		user.save(function() {
			podcast = {
				name: 'Podcast Name',
				blog: 'Testing all over the deep blue sea'
			};

			done();
		});
	});

	it('should be not able to save Podcast instance if logged in as regular user', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Podcast
				agent.post('/podcasts')
					.send(podcast)
					.expect(403)
					.end(function(podcastSaveErr, podcastSaveRes) {
						done();
					});
			});
	});
	it('should be not able to delete Podcast instance if logged in as regular user', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Set Podcast user 
				podcast.user = user;

				// Create new Podcast model instance
				var podcastObj = new Podcast(podcast);

				// Save the Podcast
				podcastObj.save(function() {
					// Try deleting Podcast
					request(app).delete('/podcasts/' + podcastObj._id)
					.expect(403)
					.end(function(podcastDeleteErr, podcastDeleteRes) {
						done();
					});

				});
			});
	});
/*
	it('should be not able to update Podcast instance if signed in as regular user', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Podcast
				agent.post('/podcasts')
					.send(podcast)
					.expect(200)
					.end(function(podcastSaveErr, podcastSaveRes) {
						// Handle Podcast save error
						if (podcastSaveErr) done(podcastSaveErr);

						// Update Podcast name
						podcast.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Podcast
						agent.put('/podcasts/' + podcastSaveRes.body._id)
							.send(podcast)
							.expect(200)
							.end(function(podcastUpdateErr, podcastUpdateRes) {
								// Handle Podcast update error
								if (podcastUpdateErr) done(podcastUpdateErr);

								// Set assertions
								(podcastUpdateRes.body._id).should.equal(podcastSaveRes.body._id);
								(podcastUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});
*/
	afterEach(function(done) {
		User.remove().exec();
		Podcast.remove().exec();
		done();
	});
});
