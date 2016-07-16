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

    User.findOne( { username: username } )
        .select('password')
        .exec(function(err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).send();
            }

            bcrypt.compare(password, user.password, function(err, valid) {
                if (err) {
                    return next(err);
                }

                if (!valid) {
                    return res.status(401).send();
                }

                var token = jwt.encode({ username: username }, config.secretKey);
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
    if (!req.headers['x-auth']) {
        return res.status(401).send({
            message: "Missing authentication token"
        });
    }

    var token = req.headers['x-auth'];

    var auth;

    try {
        auth = jwt.decode(token, config.secretKey);
    } catch (ex) {
        return res.status(401).send(ex.message);
    }

    User.findOne({
        username: auth.username
    }, function(err, user) {
        res.status(200).json(user);
    });
});

module.exports = router;