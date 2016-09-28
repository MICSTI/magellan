var router = require('express').Router();
var config = require('../../config/server');
var protectRoute = require('../protect');
var _ = require('lodash');

var User = require('../../models/user');

/**
 * Returns the high score list for the quiz.
 * Contains the overall score considering all users.
 */
router.get('/all', protectRoute, function(req, res, next) {
    getOverallHighscoreList()
        .then(function(list) {
            return res.status(200).json(list);
        })
        .catch(function(err) {
            return next(err);
        });
});

/**
 * Returns the overall high score for the quiz.
 */
router.get('/high', protectRoute, function(req, res, next) {
    getOverallHighscore()
        .then(function(highscore) {
            return res.status(200).json(highscore);
        })
        .catch(function(err) {
            return next(err);
        });
});

/**
 * Returns the high score for a specific user.
 */
router.get('/user', protectRoute, function(req, res, next) {
    return res.status(200).json(_.extend({ id: req.user._id, username: req.user.username }, findPersonalBest(req.user)));
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

    // flag to indicate whether the entry should be saved
    var saveEntry = false;

    var date = new Date();

    var scoreEntry = {
        date: date,
        score: score
    };

    // make sure user object has a scores array
    if (!req.user.scores) {
        req.user.scores = [];
    }

    // find out the user's personal best score
    var personalBest = findPersonalBest(req.user);

    // find out the overall best score at the moment
    getOverallHighscore()
        .then(function(overallBest) {
            // check if the last entry of the array is the current date
            var scoresLength = req.user.scores.length;

            if (scoresLength > 0) {
                var lastEntry = req.user.scores[scoresLength - 1];

                if (datesEqual(scoreEntry.date, lastEntry.date)) {
                    // check if score achieved now is higher than the saved one
                    if (scoreEntry.score > lastEntry.score) {
                        // remove the last entry from the array
                        req.user.scores.splice(scoresLength - 1, 1);

                        // append the score entry to the array
                        req.user.scores.push(scoreEntry);

                        // add to event array
                        events.push('new_daily_best');

                        // set save entry flag
                        saveEntry = true;
                    }
                } else {
                    // append the score entry to the array
                    req.user.scores.push(scoreEntry);

                    // add to event array
                    events.push('new_daily_entry');

                    // set save entry flag
                    saveEntry = true;
                }
            } else {
                // there are no entries yet, so we can just append it to the array
                req.user.scores.push(scoreEntry);

                // add to event array
                events.push('first_entry');

                // set save entry flag
                saveEntry = true;
            }

            // check if it was a personal best
            if (personalBest.score) {
                if (scoreEntry.score > personalBest.score) {
                    events.push('personal_best');
                } else if (scoreEntry.score === personalBest.score) {
                    events.push('personal_best_equalised');
                }
            } else {
                // since there are no entries yet, it automatically is a personal best
                events.push('personal_best');
            }

            // check if it was an overall best
            if (overallBest.score) {
                if (scoreEntry.score > overallBest.score) {
                    events.push('overall_best');
                } else if (scoreEntry.score === overallBest.score) {
                    events.push('overall_best_equalised');
                }
            } else {
                // since there are no entries yet, it automatically is an overall best
                events.push('overall_best');
            }

            if (saveEntry) {
                // save the user object
                req.user.save(function(err) {
                    if (err) {
                        return next(err);
                    }

                    return res.status(200).json({
                        events: events
                    });
                });
            } else {
                return res.status(200).json({
                    events: events
                });
            }
        })
        .catch(function(err) {
            return next(err);
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

var findPersonalBest = function(user) {
    var bestIndex = -1;

    var bestValue = -1;

    // if there are no scores, we return an empty object.
    if (!user.scores) {
        return {};
    }

    user.scores.forEach(function(entry, idx) {
        if (entry.score >= bestValue) {
            bestValue = entry.score;
            bestIndex = idx;
        }
    });

    return user.scores[bestIndex];
};

var getOverallHighscore = function() {
    return new Promise(function(resolve, reject) {
        User.find({ active: true })
            .exec(function(err, users) {
                if (err) {
                    reject(err);
                }

                var overallBest = null;

                users.forEach(function(user) {
                    var userBest = findPersonalBest(user);

                    if (!userBest) {
                        return;
                    }

                    userBest = _.extend({ id: user._id, username: user.username }, userBest);

                    if (!overallBest || userBest.score > overallBest.score) {
                        overallBest = userBest;
                    }
                });

                if (!overallBest) {
                    overallBest = {};
                }

                resolve(overallBest);
            });
    });
};

var getOverallHighscoreList = function() {
    return new Promise(function(resolve, reject) {
        User.find({ active: true })
            .exec(function(err, users) {
                if (err) {
                    reject(err);
                }

                var list = users.map(function(user) {
                    return _.extend({ id: user._id, username: user.username }, findPersonalBest(user));
                }).filter(function(user) {
                    return user.score !== undefined;
                }).sort(function(a, b) {
                    return b.score > a.score;
                });

                resolve(list);
            });
    });
};

module.exports = router;