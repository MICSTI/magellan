var path = require("path");
var express = require("express");

module.exports = function(app) {
    // static files =================================================
    app.use("/lib", express.static("lib"));
    app.use("/build", express.static("build"));
    
    // server routes ================================================
    app.get("*", function(req, res) {
        res.sendFile(path.resolve('build/views/index.html'));
    });
}