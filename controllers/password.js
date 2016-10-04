var bcrypt = require('bcryptjs');

/**
 * Sets a new password for the user.
 * @param user  (MongoDB object)
 * @param password  (String) The password to hash and save to the user object
 */
var savePassword = function(user, password) {
    return new Promise(function(resolve, reject) {
        if (!user || typeof user.save !== 'function') {
            reject('Parameter user is not a MongoDB object');
        }

        if (!password) {
            reject('Missing parameter password');
        }

        // generate salt and hash for password
        bcrypt.hash(password, 10, function(err, hash) {
            user.password = hash;

            user.save(function(err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    });
};

module.exports.savePassword = savePassword;