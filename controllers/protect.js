/**
 * Protects the current route
 * If no req.user object is found, a 403 response will be sent to the client
 */
var protectRoute = function(req, res, next) {
    if (!req.user) {
        return res.status(403).json({
            message: "Not authenticated"
        });
    }

    next();
};

module.exports = protectRoute;