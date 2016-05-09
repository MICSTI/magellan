module.exports = function(app) {
    // server routes ================================================
    app.get("*", function(req, res) {
        res.sendFile("./public/views/index.html");
    });
}