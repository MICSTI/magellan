var router = require('express').Router();
var config = require('../../config/server');
var protectRoute = require('../protect');
var _ = require('lodash');

var User = require('../../models/user');

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
 * Returns an array containing info about the effect of the put request.
 */
router.put('/', protectRoute, function(req, res, next) {
    var score = req.body.score;

    if (!score) {
        var error = new Error();

        error.status = 400;
        error.message = 'Missing body parameter: score';

        return next(error);
    }

    // event array containing all the events that have happened with this request
    // e.g. 'new_personal_best', 'new_daily_best', 'new_overall_best'
    var events = [];

    var date = new Date();

    var scoreEntry = {
        date: date,
        score: score
    };

    // make sure user object has a scores array
    if (!req.user.scores) {
        req.user.scores = [];
    }

    // check if the last entry of the array is the current date
    var scoresLength = req.user.scores.length;

    if (scoresLength > 0) {
        var lastEntry = req.user.scores[scoresLength - 1];

        if (datesEqual(scoreEntry.date, lastEntry.date)) {
            // remove the last entry from the array
            req.user.scores.splice(scoresLength - 1, 1);

            // add to event array
            events.push('new_daily_best');
        }
    }

    // append the score entry to the array
    req.user.scores.push(scoreEntry);

    // save the user object
    req.user.save(function(err) {
        if (err) {
            return next(err);
        }

        res.status(200).json({
            events: events
        });
    });
});

/**
 * Checks if two dates are the same.
 * Checked are the date, month and year field, all other are ignored.
 */
var datesEqual = function(date1, date2) {
    return  date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getYear() === date2.getYear();
};

module.exports = router;