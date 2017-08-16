var path = require("path");
var express = require("express");

module.exports = function(app) {
    // static files =================================================
    app.use("/lib", express.static("lib"));
    app.use("/dist", express.static("dist"));
    
    // server routes ================================================
    app.get('/()|(home)|(login)|(register)|(countries)|(logout)|(settings)|(about)|(password)|(reset)|(forgot)|(highscore)|(faq)|(countries-difficulty)/', function(req, res) {
        res.sendFile(path.resolve('dist/views/index.html'));
    });

    app.get("*", function(req, res, next) {
        var error = new Error();

        error.status = 404;
        error.message = "Page not found";

        return next(error);
    });
};