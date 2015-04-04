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
    console.log('Have I been here?');
    var email_text = 'You have successfully subscribe to my blog \n'+
        'I hope you will have a great time \n';

    if(!req.user){
       console.log('invalid user');
        return res.status(403).send('Please log in');
    }
    else{
        console.log(req.user.email);
        transporter.sendMail({
            from: email.user,
            to: req.user.email,
            subject: 'Welcome to my Podcast',
            text: email_text
        });
        transporter.sendMail();
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
