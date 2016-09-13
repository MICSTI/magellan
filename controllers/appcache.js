/**
 * Returns the app cache manifest file with the correct content type.
 */

var path = require('path');
var fs = require('fs');

var serveManifest = function(req, res, next) {
    fs.readFile('public/manifest/magellan.appcache', 'utf8', function(err, data) {
        if (err || !data) {
            return res.status(400).json({
                message: "No manifest file found"
            });
        }

        res.header('Content-Type', 'text/cache-manifest');
        res.status(200).send(data);
    });
};

module.exports = serveManifest;