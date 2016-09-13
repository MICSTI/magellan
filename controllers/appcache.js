/**
 * Returns the app cache manifest file with the correct content type.
 */

var config = require('../config/server');
var fs = require('fs');

var serveManifest = function(req, res, next) {
    if (!config.useAppCache) {
        return res.status(400).json({
            message: "No appcache enabled"
        });
    }

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