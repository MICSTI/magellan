var jwt = require('jwt-simple');
var bcrypt = require('bcryptjs');
var config = require('../../config/server');
var _ = require('lodash');
var protectRoute = require('../protect');

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

            bcrypt.compare(password, user.password, function(err, valid) {
                if (err) {
                    return next(err);
                }

                if (!valid) {
                    return res.status(401).send("Username or password wrong");
                }

                var token = jwt.encode({ user: user._id }, config.secretKey);
                res.status(200).json(token);
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

        // generate salt and hash for password
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            user.password = hash;
            user.save(function(err, user) {
                if (err) {
                    return res.status(400).json({
                        message: 'Failed to create user',
                        error: err
                    });
                }

                if (!user) {
                    return res.status(400).json({
                        message: 'User could not be created'
                    });
                }

                res.status(201).send();
            });
        });
    });
});

/**
 * Route for basic user update (username, email and color).
 */
router.put('/user/basic', protectRoute, function(req, res) {
    // ensure username is not already in use
    User.findOne({
        username: req.body.username
    }, function(err, existingUser) {
        if (err) {
            return next(err);
        }

        if (existingUser && !existingUser._id.equals(req.user._id)) {
            return res.status(400).send({
                message: "Username already exists"
            });
        }

        existingUser.username = req.body.username;
        existingUser.email = req.body.email;
        existingUser.color = req.body.color;

        existingUser.save(function(err) {
            if (err) {
                return next(err);
            }

            res.status(200).json(req.user);
        });
    });
});

router.get('/user', protectRoute, function(req, res) {
    // since the route is protected, we can just send back the user object
    res.status(200).json(req.user);
});

module.exports = router;