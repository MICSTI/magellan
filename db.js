var mongoose = require('mongoose');

// config files ====================================
var DB = require("./config/db");

mongoose.connect(DB.url, function(err) {
    if (err) {
        throw Error("Could not connect to MongoDB");
    }

    console.log('mongodb connected');
});

module.exports = mongoose;