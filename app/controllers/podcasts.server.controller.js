'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	fs = require('fs'),
	errorHandler = require('./errors.server.controller'),
	Podcast = mongoose.model('Podcast'),
    // Adding User mongo access
    subscriber = mongoose.model('User'),
    SubList = mongoose.model('SubList'),
    mandrill = require('mandrill-api/mandrill'),
    mail = new mandrill.Mandrill('QJOmksikpPd7wjjt29hF2A'),
	path = require('path'),
	_ = require('lodash');
/*
 * Feed control variables
 */
var rss_max_entries = 50;
function updateFeed(podcasts, user) {
	var path_to_feed = path.join(__dirname, '../..', 'public', 'feed.xml');
	var xml_text = '<?xml version = "1.0" encoding = "utf-8"?>\n' +
				   '<rss version = "2.0">\n' +
				   '\t<channel>\n' +
				   '\t\t<title>Podcasts and Blogs of ' + user.displayName + '</title>\n' +
				   '\t\t<description>Podcasts and blogs</description>\n' +
				   '\t\t<link>http://localhost:3000</link>\n';
	for (var index in podcasts) {
		var podcast = podcasts[index];
		xml_text +=
			'\t\t<item>\n' +
		        '\t\t\t<title>' + podcast.name + '</title>\n' +
		        '\t\t\t<description>' + podcast.blurb + '</description>\n' +
		        '\t\t\t<category>' + podcast.category + '</category>\n' +
		        '\t\t\t<language>en-us</language>\n' +
		        '\t\t\t<link>' + 'http://localhost:3000/#!/podcasts/' + podcast._id + '</link>\n' +
		        '\t\t\t<pubDate>' + podcast.created.toUTCString() + '</pubDate>\n' +
		        '\t\t\t<enclosure url=\"' + podcast.podIcon + '\" length="0" type="image" />\n' +
	        '\t\t</item>\n';
	}
	xml_text += '\t</channel>\n</rss>';
	fs.writeFile(path_to_feed, xml_text, function (err) {
		if (err) throw err;
	});
}



var sendNotification = function(){

    var email_text =  'There has been new changes made to my Podcast \n'+
        'Come check it out! \n';

    var subscriber_list;
    var nonUser_list;
    var user_list;
    SubList.find().exec(function(err, data) {
        if (err) {
            errorHandler(err);
        }
        else {
            nonUser_list = data;
        }
    });
    subscriber.find({ is_subscribe : true}).exec(function(err, data) {
        if (err) {
            errorHandler(err);
        }
        else {
            user_list = data;
        }
        /*        console.log(subscriber_list.length);
         console.log(subscriber_list[0].email);*/
        subscriber_list = user_list.concat(nonUser_list);
        var error_callback = function (err) {
            if (err) {
                // Mandrill returns the error as an object with name and message keys
                console.log('errname:' + err.name + '\n errKey:' + err.message);
            }
        };
        var success_callback = function (result) {
                //Sending out result is a very good way to check if you mandrill is working. But for testing, so I will comment it for now.
                //console.log(result);
        };
        for (var i = 0; i !== subscriber_list.length; ++i) {
            console.log(subscriber_list[i].email);
            var message = {
                message: {
                    from_email: 'qianwang1013@gmail.com',
                    from_name: 'Podcast Manager',
                    to: [{email: subscriber_list[i].email}],
                    subject: 'Check out what is new!',
                    text: email_text
                }
            };
            mail.messages.send(message, success_callback, error_callback);
        }
    });
};

/**
 * Create a Podcast
 */
exports.create = function(req, res) {
	var podcast = new Podcast(req.body);
	podcast.user = req.user;
	podcast.blurb = podcast.blurb.substring(0, 120);
	if (podcast.blurb === '') {
		//No need to check for out of bounds, js is cool
		podcast.blurb = podcast.blog.substring(0, 120);
		if (podcast.blog.length > 120) podcast.blurb += ' . . .';
	}
	//podcast.normalized = podcast.name.toLowerCase();
	podcast.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Podcast.find().sort('-created').limit(rss_max_entries).exec(function(err, podcasts) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					updateFeed(podcasts, req.user);
                    sendNotification();

				}
			});
			res.jsonp(podcast);
		}
	});
};

/**
 * Show the current Podcast
 */
exports.read = function(req, res) {
	res.jsonp(req.podcast);
};

/**
 * Update a Podcast
 */
exports.update = function(req, res) {
	var podcast = req.podcast ;
	podcast = _.extend(podcast , req.body);
	podcast.blurb = podcast.blurb.substring(0, 120);
	podcast.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Podcast.find().sort('-created').limit(rss_max_entries).exec(function(err, podcasts) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					updateFeed(podcasts, req.user);
                    sendNotification();
				}
			});
			res.jsonp(podcast);
		}
	});
	/*
	if (!req.isAuthenticated() || req.user.username !== 'admin') {
		podcast.listens = req.body.listens;
		podcast.totalSecondsListened = req.body.totalSecondsListened;
		podcast.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(podcast);
			}
		});
	}
	else if (req.user.username === 'admin') {
		podcast = _.extend(podcast , req.body);
		podcast.blurb = podcast.blurb.substring(0, 120);
		podcast.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				Podcast.find().sort('-created').limit(rss_max_entries).exec(function(err, podcasts) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						updateFeed(podcasts, req.user);
					}
				});
				res.jsonp(podcast);
			}
		});
	}*/
	//podcast.normalized = podcast.name.toLowerCase();
};
/**
 * Delete a Podcast
 */
exports.delete = function(req, res) {
	var podcast = req.podcast ;

	podcast.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Podcast.find().sort('-created').limit(rss_max_entries).exec(function(err, podcasts) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					updateFeed(podcasts, req.user);
                    sendNotification();
				}
			});
			res.jsonp(podcast);
		}
	});
};

/**
 * List of Podcasts
 */
exports.list = function(req, res) {
	Podcast.find().sort('-created').populate('user', 'displayName').exec(function(err, podcasts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(podcasts);
		}
	});
};

/**
 * Podcast middleware
 */
exports.podcastByID = function(req, res, next, id) { 
	Podcast.findById(id).populate('user', 'displayName').exec(function(err, podcast) {
		if (err) return next(err);
		if (! podcast) return next(new Error('Failed to load Podcast ' + id));
		req.podcast = podcast ;
		next();
	});
};

/**
 * Podcast authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.username !== 'admin') {
		return res.status(403).send('User is not authorized');
	}
	next();
};


/**
 * Podcast authorization middleware for no admin
 */
exports.hasAuthorization2 = function(req, res, next) {
	next();
};
