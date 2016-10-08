var mongoose = require('mongoose');

// config files ====================================
var DB = require("./config/db");

// to solve deprecation problem of mongoose's mpromise library
// see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

mongoose.connect(DB.url, function(err) {
    if (err) {
        throw Error("Could not connect to MongoDB");
    }

    console.log('MongoDB connected');
});

module.exports = mongoose;