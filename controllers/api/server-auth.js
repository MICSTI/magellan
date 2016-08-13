var jwt = require('jwt-simple');
var bcrypt = require('bcryptjs');
var config = require('../../config/server');
var _ = require('lodash');

var router = require('express').Router();
var User = require('../../models/user');

router.post('/session', function(req, res, next) {
    // ensure username and password were sent
    if (!req.body.username || !req.body.password) {
        return res.status(401).send();
    }

    var username = req.body.username;
    var password = req.body.password;

    User.findOne( { username: username, confirmed: true, active: true } )
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
    // ensure username and password were sent
    if (!req.body.username || !req.body.password) {
        return res.status(401).send();
    }

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
            username: req.body.username
        });

        // generate salt and hash for password
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            user.password = hash;
            user.save(function(err, user) {
                if (err) {
                    return next(err);
                }
            });

            res.status(201).send();
        });
    });
});

router.get('/user', function(req, res, next) {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(403).json({
            message: "Not authenticated"
        });
    }
});

module.exports = router;