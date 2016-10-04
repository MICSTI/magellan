/**
 * Returns a random alphanumerical string
 * @param len   String length (defaults to 10)
 */
var getRandomString = function(len) {
    // default value for string length
    len = len !== undefined ? len : 10;

    // possible character
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    // result array
    var result = [];

    do {
        result.push(possibleCharacters[getRandomNumberBetween(0, possibleCharacters.length - 1)]);
    } while (result.length < len);

    return result.join('');
};

/**
 * Returns a random number between the specified threshold values.
 * Both threshold values are inclusive.
 * @param low   (number) low threshold
 * @param high  (number) high threshold
 */
var getRandomNumberBetween = function(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
};

module.exports.getRandomString = getRandomString;
module.exports.getRandomNumberBetween = getRandomNumberBetween;