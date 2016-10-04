var jwt = require('jwt-simple');
var config = require('../../config/server');
var _ = require('lodash');
var protectRoute = require('../protect');
var passwordUtil = require('../password');

var router = require('express').Router();
var User = require('../../models/user');

router.post('/session', function(req, res, next) {
    // ensure username and password were sent
    if (!req.body.username || !req.body.password) {
        return res.status(401).send();
    }

    var username = req.body.username;
    var password = req.body.password;

    User.findOne( { username: username, active: true } )
        .select('password')
        .exec(function(err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).send("Username or password not valid");
            }

            passwordUtil.comparePassword(password, user.password)
                .then(function() {
                    var token = jwt.encode({ user: user._id }, config.secretKey);
                    return res.status(200).json(token);
                })
                .catch(function(errorMessage) {
                    var error = new Error();

                    error.status = 401;
                    error.message = errorMessage;

                    return next(error);
                });
        });
});

router.post('/user', function(req, res, next) {
    // ensure username is not already in use
    User.findOne({
        username: req.body.username
    }, function(err, existingUser) {
        if (err) {
            return next(err);
        }

        if (existingUser) {
            return res.status(400).send({
                message: "Username already exists"
            });
        }

        // create new user
        var user = new User({
            username: req.body.username,
            email: req.body.email,
            color: req.body.color
        });

        // generate salt and hash for password and save it to the user object
        passwordUtil.savePassword(user, req.body.password)
            .then(function() {
                return res.status(201).send();
            })
            .catch(function(err) {
                return next(err);
            });
    });
});

/**
 * Route for basic user update (username, email and color).
 */
router.put('/user/basic', protectRoute, function(req, res, next) {
    // ensure username is not already in use
    User.findOne({
        username: req.body.username
    }, function(err, existingUser) {
        if (err) {
            return next(err);
        }

        if (existingUser && !existingUser._id.equals(req.user._id)) {
            var error = new Error();

            error.status = 400;
            error.message = "Username already exists";

            return next(error);
        }

        // find the own user
        User.findOne({
            _id: req.user._id
        }, function(err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                var error = new Error();

                error.message = 'No user with this id found';

                return next(error);
            }

            user.username = req.body.username;
            user.email = req.body.email;
            user.color = req.body.color;

            user.save(function(err) {
                if (err) {
                    return next(err);
                }

                res.status(200).json(user);
            });
        });
    });
});

/**
 * Route handler for updating a user's password.
 */
router.put('/user/password', protectRoute, function(req, res, next) {
    var password = req.body.password;

    if (!password) {
        var error = new Error();

        error.status = 400;
        error.message = 'Missing parameter password';

        return next(error);
    }

    passwordUtil.savePassword(req.user, password)
        .then(function() {
            return res.status(200).send();
        })
        .catch(function(err) {
            return next(err);
        });
});

router.get('/user', protectRoute, function(req, res) {
    // since the route is protected, we can just send back the user object
    res.status(200).json(req.user);
});

module.exports = router;