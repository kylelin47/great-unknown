'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    About = mongoose.model('About'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, about;

describe('About CRUD tests for non-admins', function() {
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
            about = {
                name: 'About Name'
            };

            done();
        });
    });

    it('should be not able to save About instance if logged in as regular user', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new Podcast
                agent.post('/about')
                    .send(about)
                    .expect(403)
                    .end(function(aboutSaveErr, aboutSaveRes) {
                        done();
                    });
            });
    });

    afterEach(function(done) {
        User.remove().exec();
        About.remove().exec();
        done();
    });
});
