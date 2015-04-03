'use strict';

var nodemailer = require('nodemailer');

var user;
var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'qianwang1013@hotmail.com',
        pass: '13564588122'
    }
});
var email_text = 'You have successfully subscribe to my blog \n'+
                    'I hope you will have a great time \n';
    transporter.sendMail({
        from: 'qianwang1013@hotmail.com',
        to: 'qianwang1013@gmail.com',
        subject: 'Welcome to my Podcast',
        text: email_text

    });



/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};
