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
describe('Podcast CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
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
				name: 'Podcast Name'
			};

			done();
		});
	});

	it('should be able to save Podcast instance if logged in', function(done) {
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

						// Get a list of Podcasts
						agent.get('/podcasts')
							.end(function(podcastsGetErr, podcastsGetRes) {
								// Handle Podcast save error
								if (podcastsGetErr) done(podcastsGetErr);

								// Get Podcasts list
								var podcasts = podcastsGetRes.body;

								// Set assertions
								(podcasts[0].user._id).should.equal(userId);
								(podcasts[0].name).should.match('Podcast Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Podcast instance if not logged in', function(done) {
		agent.post('/podcasts')
			.send(podcast)
			.expect(401)
			.end(function(podcastSaveErr, podcastSaveRes) {
				// Call the assertion callback
				done(podcastSaveErr);
			});
	});

	it('should not be able to save Podcast instance if no name is provided', function(done) {
		// Invalidate name field
		podcast.name = '';

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
					.expect(400)
					.end(function(podcastSaveErr, podcastSaveRes) {
						// Set message assertion
						(podcastSaveRes.body.message).should.match('Please fill Podcast name');
						
						// Handle Podcast save error
						done(podcastSaveErr);
					});
			});
	});

	it('should be able to update Podcast instance if signed in', function(done) {
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

	it('should be able to get a list of Podcasts if not signed in', function(done) {
		// Create new Podcast model instance
		var podcastObj = new Podcast(podcast);

		// Save the Podcast
		podcastObj.save(function() {
			// Request Podcasts
			request(app).get('/podcasts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Podcast if not signed in', function(done) {
		// Create new Podcast model instance
		var podcastObj = new Podcast(podcast);

		// Save the Podcast
		podcastObj.save(function() {
			request(app).get('/podcasts/' + podcastObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', podcast.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Podcast instance if signed in', function(done) {
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

						// Delete existing Podcast
						agent.delete('/podcasts/' + podcastSaveRes.body._id)
							.send(podcast)
							.expect(200)
							.end(function(podcastDeleteErr, podcastDeleteRes) {
								// Handle Podcast error error
								if (podcastDeleteErr) done(podcastDeleteErr);

								// Set assertions
								(podcastDeleteRes.body._id).should.equal(podcastSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Podcast instance if not signed in', function(done) {
		// Set Podcast user 
		podcast.user = user;

		// Create new Podcast model instance
		var podcastObj = new Podcast(podcast);

		// Save the Podcast
		podcastObj.save(function() {
			// Try deleting Podcast
			request(app).delete('/podcasts/' + podcastObj._id)
			.expect(401)
			.end(function(podcastDeleteErr, podcastDeleteRes) {
				// Set message assertion
				(podcastDeleteRes.body.message).should.match('User is not logged in');

				// Handle Podcast error error
				done(podcastDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Podcast.remove().exec();
		done();
	});
});