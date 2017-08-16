/**
 * Looks for the 'X-Auth' header containing a JWT and tries to find a matching user in the database.
 * If a user is found, it is attached to the request object.
 * If an error occurs, no JWT was passed or no matching user was found, simply the next middleware is invoked.
 */

var jwt = require('jwt-simple');
var config = require('../config/server');
var User = require('../models/user');

var parseAuthToken = function(req, res, next) {
    // in case there is a user object attached to req, delete it
    if (req && req.user) {
        delete req.user;
    }

    var token = req.headers['x-auth'];

    if (!token) {
        return next();
    }

    var auth;

    try {
        auth = jwt.decode(token, config.secretKey);
    } catch (ex) {
        return next();
    }

    User.findOne({
        _id: auth.user
    }).select('+password')
        .exec(function(err, user) {
            if (err) {
                return next();
            }

            if (user) {
                var userObj = user.toObject();

                // check if user object has a password property
                if (userObj.password !== undefined) {
                    // attach info to user object
                    userObj.hasPassword = true;

                    // remove the password hash from the return object
                    delete userObj.password;
                } else {
                    userObj.hasPassword = false;
                }

                // attach user object to request
                req.user = userObj;
            }

            next();
        });

    /*User.findOne({
        _id: auth.user
    }, function(err, user) {
        if (err) {
            return next();
        }

        console.log('USER', user);

        if (user) {
            // attach user object to request
            req.user = user;
        }

        next();
    });*/
};

module.exports = parseAuthToken;