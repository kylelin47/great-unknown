'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user;

/**
 * Core routes tests
 */
describe('Core Server Routes tests', function() {
    beforeEach(function(done) {
        // Create user credentials
        credentials = {
            username: 'admin',
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

        user.save(function() {
            done();
        });
    });

    it('should be able to subscribe to RSS feed if email is provided', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);
                agent.post('/core/cus_sendMail')
                    .expect(200)
                    .end(function(err, res) {
                        // Handle Podcast save error
                        if (err) done(err);
                        done();
                    });
            });
    });

    it('should return error if trying to subscribe to RSS feed if no email is provided', function(done) {
        agent.post('/core/cus_sendMail')
            .expect(403)
            .end(function(err, res) {
                // Handle Podcast save error
                if (err) done(res);
                done();
            });
    });

    afterEach(function(done) {
        User.remove().exec();
        done();
    });
});
