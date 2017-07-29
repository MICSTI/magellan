var bcrypt = require('bcryptjs');

var config = require('../config/server');
var PasswordRequirementsValidator = require('../public/js/models').PasswordRequirementsValidator;

// configure the password requirements validator
var validator = new PasswordRequirementsValidator();
validator.setConfig(config.passwordRequirements);

/**
 * Sets a new password for the user.
 * @param user  (MongoDB object)
 * @param password  (String) The password to hash and save to the user object
 */
var savePassword = function(user, password) {
    return new Promise(function(resolve, reject) {
        if (!user || typeof user.save !== 'function') {
            return reject('Parameter user is not a MongoDB object');
        }

        if (!password) {
            return reject('Missing parameter password');
        }

        // check if password matches the requirements
        var checkResult = validator.check(password);

        if (checkResult.passwordOk === false) {
            return reject({
                message: 'Password does not match requirements',
                info: checkResult.failedChecks
            });
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

/**
 * Compares the hashes of two passwords.
 * @param password1
 * @param password2
 * @returns {Promise}
 */
var comparePassword = function(password1, password2) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(password1, password2, function(err, valid) {
            if (err) {
                return reject(err);
            }

            if (!valid) {
                return reject('Username or password wrong');
            }

            return resolve();
        });
    });
};

module.exports.savePassword = savePassword;
module.exports.comparePassword = comparePassword;