var router = require('express').Router();
var Country = require('../../models/country');

router.get('/', function(req, res, next) {
    Country.find(function(err, countries) {
        if (err) {
            return next(err);
        }

        res.status(200).json(countries);
    });
});

router.post('/', function(req, res, next) {
    var country = new Country({
        name: req.body.name
    });

    country.save(function(err, country) {
        if (err) {
            return next(err);
        }

        res.status(201).json(country);
    });
});

module.exports = router;