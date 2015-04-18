'use strict';

var mongoose = require('mongoose'),
    admin = mongoose.model('User'),
    errorHandler = require('./errors.server.controller'),
    mandrill = require('mandrill-api/mandrill'),
    mail = new mandrill.Mandrill('QJOmksikpPd7wjjt29hF2A'),
    SubList = mongoose.model('SubList');


exports.cus_sendMail = function(req,res,user){
    var email_text = 'You have successfully subscribe to my blog \n'+
        'I hope you will have a great time \n';
    var message = {
        message: {
            from_email: 'qianwang1013@gmail.com',
            from_name: 'Podcast Manager',
            to: [{email: req.user.email}],
            subject: 'Welcome to my Podcast',
            text: email_text
        }
    };

    if(!req.user){
        return res.status(403).send('No email address found. Please sign in and associate an email address to subscribe.');
    }
    else{

        mail.messages.send(message, function(result) {
            //Sending out result is a very good way to check if you mandrill is working. But for testing, so I will comment it for now.
            //console.log(result);
            req.user.is_subscribe = true;
            req.user.save();
            return res.send('An email has been sent to your associated address \'' + req.user.email + '\'');
        }, function(err) {
            if(err){
                // Mandrill returns the error as an object with name and message keys
                console.log('errname:' + err.name +'\n errKey:'+ err.message);
            }

        });

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

/*
* For the non-users
* */
/**
 * Create a About
 */
exports.non_user = function(req, res) {
    var sublist = new SubList(req.body);
    console.log(sublist);
    sublist.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var email_text = 'You have successfully subscribe to my blog \n'+
                'I hope you will have a great time \n';
            var message = {
                message: {
                    from_email: 'qianwang1013@gmail.com',
                    from_name: 'Podcast Manager',
                    to: [{email: sublist.email}],
                    subject: 'Welcome to my Podcast',
                    text: email_text
                }
            };
            mail.messages.send(message, function(result) {
                //Sending out result is a very good way to check if you mandrill is working. But for testing, so I will comment it for now.
                console.log(result);
                return res.send('An email has been sent to your associated address \'' + sublist.email + '\'' + 'Please join us by sign up a free account');
            }, function(err) {
                if(err){
                    // Mandrill returns the error as an object with name and message keys
                    console.log('errname:' + err.name +'\n errKey:'+ err.message);
                }

            });
        }
    });


};

