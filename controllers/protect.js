/**
 * Protects the current route
 * If no req.user object is found, a 403 response will be sent to the client
 */
var protectRoute = function(req, res, next) {
    if (!req.user) {
        var error = new Error();

        error.status = 403;
        error.message = 'Not authenticated';

        return next(error);
    }

    next();
};

module.exports = protectRoute;