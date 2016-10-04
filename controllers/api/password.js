var router = require('express').Router();
var mailer = require('../../controllers/mailer');
var util = require('../util');

var User = require('../../models/user');

router.post('/forgot', function(req, res, next) {
    var email = req.body.email;

    if (email === undefined) {
        var error = new Error();

        error.status = 400;
        error.message = "Missing e-mail address in request body";

        return next(error);
    }

    // try to find the user with this e-mail address
    User.findOne({ email: email }, function(err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            var error = new Error();

            error.status = 400;
            error.message = "No user with this e-mail address found";

            return next(error);
        }

        // add reset token to user
        var token = util.getRandomString(24);
        var valid = Date.now() + (3600000 * 24);    // 24 hours

        user.resetToken = token;
        user.resetTokenValid = valid;

        // save user object
        user.save(function(err) {
            if (err) {
                return next(err);
            }

            var protocol = req.secure ? 'https' : 'http';
            var baseUrl = req.headers.host;
            var apiUrl = '/api/password/reset/' + user.resetToken;

            var resetLink = protocol + '://' + baseUrl + apiUrl;

            // send e-mail
            mailer.sendMail({
                to: user.email,
                subject: '[Magellan] Passwort vergessen',
                type: 'html',
                content: '<a href="' + resetLink + '">Passwort zurücksetzen</a>'
            }).then(function(data) {
                return res.status(201).json({
                    message: "Mail sent",
                    valid: "24h"
                });
            }).catch(function(err) {
                return next(err);
            });
        });
    });
});

module.exports = router;