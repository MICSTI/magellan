var router = require('express').Router();
var Country = require('../../models/country');
var config = require('../../config/server');
var protectRoute = require('../protect');
var fs = require('fs');

// read the countries.json file
var countries = JSON.parse(fs.readFileSync('./assets/countries.json', 'utf8'));

/**
 * Returns the current version of the countries JSON file.
 */
router.get('/version', protectRoute, function(req, res, next) {
    var version = config.countriesFile.version;

    if (!version) {
        return res.status(400).json({
            message: 'No version found'
        });
    }

    res.status(200).json({
        version: version
    });
});

/**
 * Returns an array containing all countries
 */
router.get('/', protectRoute, function(req, res, next) {
    res.status(200).json(countries);
});

module.exports = router;