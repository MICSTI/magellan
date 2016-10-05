var router = require('express').Router();
var mailer = require('../../controllers/mailer');
var util = require('../util');
var passwordUtil = require('../password');

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
            var apiUrl = '/password/reset/' + user.resetToken;

            var resetLink = protocol + '://' + baseUrl + apiUrl;

            var mailContent = '<div style="font-family: Arial, sans-serif">' +
                                '<div style="font-weight: bold; font-size: 1.25em">Magellan - Passwort zurücksetzen</div>' +
                                '<div style="margin-top: 2em"><a href="{LINK_URL}">Passwort zurücksetzen</a></div>' +
                                '<div style="margin-top: 2em">Dieser Link ist 24 Stunden lang gültig.</div>' +
                              '</div>';

            // send e-mail
            mailer.sendMail({
                to: user.email,
                subject: '[Magellan] Passwort vergessen',
                mode: 'html',
                content: mailContent.replace('{LINK_URL}', resetLink)
            }).then(function(data) {
                return res.status(201).json({
                    message: "Mail sent",
                    valid: "24"
                });
            }).catch(function(err) {
                return next(err);
            });
        });
    });
});

router.get('/reset/:token', function(req, res, next) {
    var token = req.params.token;

    checkTokenValidity(token)
        .then(function(user) {
            res.status(200).json({
                message: "Token valid"
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

router.post('/reset', function(req, res, next) {
    var error;

    var token = req.body.token;
    var password = req.body.password;

    if (!token) {
        error = new Error();
        error.status = 400;
        error.message = "Missing token";

        return next(error);
    }

    if (!password) {
        error = new Error();
        error.status = 400;
        error.message = "Missing password";

        return next(error);
    }

    checkTokenValidity(token)
        .then(function(user) {
            // invalidate reset token to prevent further use
            user.resetToken = undefined;
            user.resetTokenValid = undefined;

            passwordUtil.savePassword(user, password)
                .then(function() {
                    return res.status(200).json({
                        message: 'Password saved successfully'
                    });
                })
                .catch(function(err) {
                    return next(err);
                });
        })
        .catch(function(err) {
            return next(err);
        });
});

/**
 * Checks if a password reset token exists and is valid.
 * @param token     (String) Password reset token
 * @returns {Promise}
 */
var checkTokenValidity = function(token) {
    return new Promise(function(resolve, reject) {
        var error;

        User.findOne({ resetToken: token }, function(err, user) {
            if (err) {
                return reject(err);
            }

            if (!user) {
                error = new Error();

                error.status = 400;
                error.message = "Invalid token";

                return reject(error);
            }

            // check if token is valid
            var now = Date.now();

            if (now > user.resetTokenValid) {
                error = new Error();

                error.status = 400;
                error.message = "Reset token has expired";

                return reject(error);
            }

            return resolve(user);
        });
    });
};

module.exports = router;