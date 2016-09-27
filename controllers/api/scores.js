var router = require('express').Router();
var config = require('../../config/server');
var protectRoute = require('../protect');

/**
 * Returns the high score list for the quiz.
 * Contains the overall score considering all users.
 */
router.get('/', protectRoute, function(req, res, next) {
    res.status(501).send();
});

/**
 * Returns the high score list for a specific user.
 */
router.get('/:userId', protectRoute, function(req, res, next) {
    res.status(501).send();
});

/**
 * Puts a high score for the logged in user.
 */
router.put('/', protectRoute, function(req, res, next) {
    res.status(501).send();
});

module.exports = router;