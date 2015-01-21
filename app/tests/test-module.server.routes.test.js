'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	TestModule = mongoose.model('TestModule'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, testModule;

/**
 * Test module routes tests
 */
describe('Test module CRUD tests', function() {
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

		// Save a user to the test db and create new Test module
		user.save(function() {
			testModule = {
				name: 'Test module Name'
			};

			done();
		});
	});

	it('should be able to save Test module instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Test module
				agent.post('/test-modules')
					.send(testModule)
					.expect(200)
					.end(function(testModuleSaveErr, testModuleSaveRes) {
						// Handle Test module save error
						if (testModuleSaveErr) done(testModuleSaveErr);

						// Get a list of Test modules
						agent.get('/test-modules')
							.end(function(testModulesGetErr, testModulesGetRes) {
								// Handle Test module save error
								if (testModulesGetErr) done(testModulesGetErr);

								// Get Test modules list
								var testModules = testModulesGetRes.body;

								// Set assertions
								(testModules[0].user._id).should.equal(userId);
								(testModules[0].name).should.match('Test module Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Test module instance if not logged in', function(done) {
		agent.post('/test-modules')
			.send(testModule)
			.expect(401)
			.end(function(testModuleSaveErr, testModuleSaveRes) {
				// Call the assertion callback
				done(testModuleSaveErr);
			});
	});

	it('should not be able to save Test module instance if no name is provided', function(done) {
		// Invalidate name field
		testModule.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Test module
				agent.post('/test-modules')
					.send(testModule)
					.expect(400)
					.end(function(testModuleSaveErr, testModuleSaveRes) {
						// Set message assertion
						(testModuleSaveRes.body.message).should.match('Please fill Test module name');
						
						// Handle Test module save error
						done(testModuleSaveErr);
					});
			});
	});

	it('should be able to update Test module instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Test module
				agent.post('/test-modules')
					.send(testModule)
					.expect(200)
					.end(function(testModuleSaveErr, testModuleSaveRes) {
						// Handle Test module save error
						if (testModuleSaveErr) done(testModuleSaveErr);

						// Update Test module name
						testModule.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Test module
						agent.put('/test-modules/' + testModuleSaveRes.body._id)
							.send(testModule)
							.expect(200)
							.end(function(testModuleUpdateErr, testModuleUpdateRes) {
								// Handle Test module update error
								if (testModuleUpdateErr) done(testModuleUpdateErr);

								// Set assertions
								(testModuleUpdateRes.body._id).should.equal(testModuleSaveRes.body._id);
								(testModuleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Test modules if not signed in', function(done) {
		// Create new Test module model instance
		var testModuleObj = new TestModule(testModule);

		// Save the Test module
		testModuleObj.save(function() {
			// Request Test modules
			request(app).get('/test-modules')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Test module if not signed in', function(done) {
		// Create new Test module model instance
		var testModuleObj = new TestModule(testModule);

		// Save the Test module
		testModuleObj.save(function() {
			request(app).get('/test-modules/' + testModuleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', testModule.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Test module instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Test module
				agent.post('/test-modules')
					.send(testModule)
					.expect(200)
					.end(function(testModuleSaveErr, testModuleSaveRes) {
						// Handle Test module save error
						if (testModuleSaveErr) done(testModuleSaveErr);

						// Delete existing Test module
						agent.delete('/test-modules/' + testModuleSaveRes.body._id)
							.send(testModule)
							.expect(200)
							.end(function(testModuleDeleteErr, testModuleDeleteRes) {
								// Handle Test module error error
								if (testModuleDeleteErr) done(testModuleDeleteErr);

								// Set assertions
								(testModuleDeleteRes.body._id).should.equal(testModuleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Test module instance if not signed in', function(done) {
		// Set Test module user 
		testModule.user = user;

		// Create new Test module model instance
		var testModuleObj = new TestModule(testModule);

		// Save the Test module
		testModuleObj.save(function() {
			// Try deleting Test module
			request(app).delete('/test-modules/' + testModuleObj._id)
			.expect(401)
			.end(function(testModuleDeleteErr, testModuleDeleteRes) {
				// Set message assertion
				(testModuleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Test module error error
				done(testModuleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		TestModule.remove().exec();
		done();
	});
});