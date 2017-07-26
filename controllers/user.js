var User = require('../models/user');

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

module.exports.findUserByUsernameOrMail = findUserByUsernameOrMail;