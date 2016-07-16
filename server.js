// modules ====================================
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

// config files ====================================
var SERVER = require("./config/server");

// set port
var port = process.env.PORT || SERVER.port;

// get all data of the body (POST) parameters
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set the static files location (/public/img will be /img for users)
app.use(express.static(__dirname + "/public"));

// routes ====================================
app.use('/api', require('./controllers/api/users.js'));
app.use('/api/countries', require('./controllers/api/countries.js'));

require("./app/routes")(app);

// start app ====================================
app.listen(port);

// console message
console.log("Magellan started on port", port);

// expose app
exports = module.exports = app;