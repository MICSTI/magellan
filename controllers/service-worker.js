var fs = require('fs');

var serveServiceWorker = function(req, res, next) {
    fs.readFile('public/js/service-worker.js', 'utf8', function(err, data) {
        if (err || !data) {
            var error = new Error();
            error.status = 500;
            error.message = 'Could not read service worker file';

            return next(error);
        }

        res.header('Content-Type', 'application/javascript');
        res.status(200).send(data);
    });
};

module.exports = serveServiceWorker;