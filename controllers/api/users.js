var jwt = require('jwt-simple');
var config = require('../../config/server');
var router = require('express').Router();
var User = require('../../models/user');

router.post('/session', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(401).send();
    }

    var username = req.body.username;
    var password = req.body.password;

    // TODO: Validate password
    

    var token = jwt.encode({ username: username }, config.secretKey);
    res.status(200).json(token);
});

router.get('/user', function(req, res, next) {
    if (!req.headers['x-auth']) {
        return res.status(401).send("Missing authentication token");
    }

    var token = req.headers['x-auth'];

    var user = null;

    try {
        user = jwt.decode(token, config.secretKey);
    } catch (ex) {
        return res.status(401).send(ex.message);
    }

    // TODO: load user info from database

    res.status(200).json(user)

});

module.exports = router;