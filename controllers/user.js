var User = require('../models/user');
var config = require('../config/server');
var getRandomInt = require('../public/js/models').getRandomInt;

/**
 * Finds a user by username or mail address and returns that user object if successful through the resolve promise.
 * If no user is found, the promise is rejected with the value null.
 * @param usernameOrMail (String) User input of username or mail address
 * @returns {Promise}
 */
var findUserByUsernameOrMail = function(usernameOrMail) {
    return new Promise(function(resolve, reject) {
        if (usernameOrMail === undefined) {
            return reject("Missing parameter usernameOrMail");
        }

        // try to locate user by username
        User.findOne( { username: usernameOrMail, active: true } )
            .select('password')
            .exec(function(err, userByUsername) {
                if (err) {
                    return reject(err);
                }

                if (userByUsername !== null) {
                    return resolve(userByUsername);
                } else {
                    // try to locate user by mail address
                    User.findOne( { email: usernameOrMail, active: true } )
                        .select('password')
                        .exec(function(err, userByMail) {
                            if (err) {
                                return reject(err);
                            }

                            if (userByMail !== null) {
                                return resolve(userByMail);
                            } else {
                                return reject("Username or password not valid");
                            }
                        });
                }
            });
    });
};

var findUserByOAuthProviderId = function(provider, id) {
    return new Promise(function(resolve, reject) {
        if (provider === undefined) {
            return reject("Missing parameter 'provider'");
        }

        if (id === undefined) {
            return reject("Missing parameter 'id'");
        }

        // create user object to find
        var userObj = {};
        userObj[provider] = id;

        User.findOne(userObj, function(err, user) {
            if (err) {
                return reject(err);
            }

            if (!user) {
                // we resolve with null to indicate that no user with this provider/id combination exists yet
                return resolve(null);
            }

            resolve(user);
        });
    });
};

var saveUserWithOAuthProviderId = function(userProfile) {
    return new Promise(function(resolve, reject) {
        if (userProfile === undefined) {
            return reject("Missing parameter 'userProfile'");
        }

        var emailAddress = userProfile.emails[0].value;

        var provider = userProfile.provider;
        var id = userProfile.id;

        var colors = config.colors || [];

        // first check if the user already registered with this e-mail address regularly
        User.findOne({
            email: emailAddress
        }, function(err, userObj) {
            if (err) {
                return reject(err);
            }

            var user;

            if (!userObj) {
                user = new User();

                user.email = emailAddress;

                // assign color to user
                if (colors.length > 0) {
                    user.color = colors[getRandomInt(0, colors.length - 1)]
                } else {
                    user.color = 'soft_red';
                }

                // variable for storing family name (the full family name should not be disclosed automatically, unless the user does so himself / herself
                var familyName;

                // get username - we only have to do this if the user object didn't already exist
                switch (provider) {
                    case 'facebook':
                        if (userProfile.username !== undefined) {
                            user.username = userProfile.username;
                        } else if (userProfile.displayName !== undefined) {
                            user.username = userProfile.displayName;
                        } else {
                            // only use the first letter of familyName
                            familyName = userProfile.name.familyName ? userProfile.name.familyName.substr(0, 1) + '.' : "";

                            if (familyName) {
                                user.username = userProfile.name.givenName + ' ' + familyName;
                            } else {
                                user.username = userProfile.name.givenName;
                            }
                        }

                        break;

                    case 'google':
                        if (userProfile.username !== undefined) {
                            user.username = userProfile.username;
                        } else if (userProfile.displayName !== undefined) {
                            user.username = userProfile.displayName;
                        } else {
                            // only use the first letter of familyName
                            familyName = userProfile.name.familyName ? userProfile.name.familyName.substr(0, 1) + '.' : "";

                            if (familyName) {
                                user.username = userProfile.name.givenName + ' ' + familyName;
                            } else {
                                user.username = userProfile.name.givenName;
                            }
                        }

                        break;

                    default:
                        return reject("Unknown provider '" + provider + "'");

                        break;
                }
            } else {
                user = userObj;
            }

            // add provider to user
            user[provider] = id;

            // TODO we must ensure that the username is unique!!!

            // save new user object
            user.save(function(err) {
                if (err) {
                    return reject(err);
                }

                resolve(user);
            });
        });
    });
};

module.exports.findUserByUsernameOrMail = findUserByUsernameOrMail;
module.exports.findUserByOAuthProviderId = findUserByOAuthProviderId;
module.exports.saveUserWithOAuthProviderId = saveUserWithOAuthProviderId;