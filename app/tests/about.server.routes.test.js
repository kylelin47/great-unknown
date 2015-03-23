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

/**
 * About routes tests
 */
describe('About CRUD tests', function() {
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

        // Save a user to the test db and create new About
        user.save(function() {
            about = {
                name: 'About Name',
                about: 'Testing all over the deep blue sea'
            };

            done();
        });
    });

    it('should be able to save About instance if logged in as admin', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new About
                agent.post('/about')
                    .send(about)
                    .expect(200)
                    .end(function(aboutSaveErr, aboutSaveRes) {
                        // Handle About save error
                        if (aboutSaveErr) done(aboutSaveErr);

                        // Get a list of Abouts
                        agent.get('/about')
                            .end(function(aboutGetErr, aboutGetRes) {
                                // Handle About save error
                                if (aboutGetErr) done(aboutGetErr);

                                // Get Abouts list
                                var about = aboutGetRes.body;

                                // Set assertions
                                (about[0].name).should.match('About Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save About instance if not logged in', function(done) {
        agent.post('/about')
            .send(about)
            .expect(401)
            .end(function(aboutSaveErr, aboutSaveRes) {
                // Call the assertion callback
                done(aboutSaveErr);
            });
    });

    it('should be able to get a list of Abouts if not signed in', function(done) {
        // Create new About model instance
        var aboutObj = new About(about);

        // Save the About
        aboutObj.save(function() {
            // Request Abouts
            request(app).get('/about')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should only retrieve one About if not signed in even if multiple are saved', function(done) {
        // Create new About model instance
        var aboutObj = new About(about);
        var aboutObj2 = new About(about);
        // Save the About
        aboutObj.save(function() {
            aboutObj2.save(function() {
                // Request Abouts
                request(app).get('/about')
                    .end(function(req, res) {
                        // Set assertion
                        res.body.should.be.an.Array.with.lengthOf(1);

                        // Call the assertion callback
                        done();
                    });
            })
        });
    });

    afterEach(function(done) {
        User.remove().exec();
        About.remove().exec();
        done();
    });
});
