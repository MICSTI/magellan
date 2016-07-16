var path = require("path");
var express = require("express");

var Country = require('../models/country');

module.exports = function(app) {
    // static files =================================================
    app.use("/lib", express.static("lib"));
    app.use("/build", express.static("build"));

    // api routes ===================================================
    app.get('/api/countries', function(req, res, next) {
        Country.find(function(err, countries) {
            if (err) {
                return next(err);
            }

            res.status(200).json(countries);
        });
    });

    app.post('/api/countries', function(req, res, next) {
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

    // server routes ================================================
    app.get("*", function(req, res) {
        res.sendFile(path.resolve('build/index.html'));
    });
}