// modules ====================================
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var authentication = require('./controllers/authentication');
var appcache = require('./controllers/appcache');
var errorHandler = require('./controllers/error-handler');
var favicon = require('serve-favicon');
var compression = require('compression');

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

// parse JWT token
app.use(authentication);

// favicon
app.use(favicon(__dirname + '/assets/favicon.ico'));

// manifest file
app.use('/magellan.appcache', appcache);

// compression (should be placed before express.static)
app.use(compression({
    filter: function (req, res) {
        return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 6
}));

// set the static files location (/public/img will be /img for users)
app.use(express.static(__dirname + "/public"));

// routes ====================================
app.use('/api', require('./controllers/api/server-auth.js'));
app.use('/api/countries', require('./controllers/api/countries.js'));
app.use('/api/scores', require('./controllers/api/scores.js'));
app.use('/api/password', require('./controllers/api/password.js'));
app.use('/api/event', require('./controllers/api/events.js'));

require("./app/routes")(app);

// error handler ====================================
app.use(errorHandler);

// disable X-Powered-By header ===================
app.disable('x-powered-by');

// start app ====================================
app.listen(port);

// console message
console.log("Magellan started on port", port);

// expose app
exports = module.exports = app;