'use strict';

module.exports = {
	db: {
		uri: 'mongodb://localhost/mean-dev',
		options: {
			user: '',
			pass: ''
		}
	},
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'dev',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			//stream: 'access.log'
		}
	},
	app: {
		title: 'Podcast Manager - Development',
		description: 'Full-Stack JavaScript Podcast Manager with MongoDB, Express, AngularJS, and Node.js',
		admin_username: 'admin'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1544617902479843',
		clientSecret: process.env.FACEBOOK_SECRET || 'f703763d3967d759dd4ca71bbd2714fe',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'w5u61kjvlIUBJtN4dwuGKaslf',
		clientSecret: process.env.TWITTER_SECRET || 'ja5nLouqaTECAYJ7jYx5PlHkdIJOAr7EjZ9TlXKr21F2jhaDvr',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
