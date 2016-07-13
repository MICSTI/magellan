var mongoose = require('mongoose');

// config files ====================================
var DB = require("./config/db");

mongoose.connect(DB.url, function() {
    console.log('mongodb connected');
});

module.exports = mongoose;