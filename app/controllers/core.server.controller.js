'use strict';

var nodemailer = require('nodemailer');
var email =
{
    service: 'hotmail',
    user:'qianwang1013@hotmail.com',
    pass:'13564588122'
};
var transporter = nodemailer.createTransport({
    service: email.service,
    auth: {
        user: email.user,
        pass: email.pass
    }
});


exports.cus_sendMail = function(req,res,user){
    var email_text = 'You have successfully subscribe to my blog \n'+
        'I hope you will have a great time \n';

    if(!req.user){
        return res.status(403).send('Please log in');
    }
    else{
        transporter.sendMail({
            from: email.user,
            to: req.user.email,
            subject: 'Welcome to my Podcast',
            text: email_text
        });
        return res.send('Successfully subscribed');
    }

};
/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};
