var path = require("path");

module.exports = function(app) {
    // server routes ================================================
    app.get("*", function(req, res) {
        res.sendFile(path.resolve('build/index.html'));
    });
}