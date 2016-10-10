var router = require('express').Router();
var protectRoute = require('../protect');

var Event = require('../../models/event');

/**
 * Increases the event count for the event with a matching name.
 * If no such event exists, it is created
 */
router.post('/add', protectRoute, function(req, res, next) {
    var error;

    var name = req.body.name;

    if (!name) {
        error = new Error();
        error.status = 400;
        error.message = 'Missing parameter name';
        return next(error);
    }

    Event.find({ name: name })
        .limit(1)
        .exec(function(err, events) {
            if (err) {
                return next(err);
            }

            var date = new Date();
            var year = String(date.getYear() + 1900);
            var month = String(date.getMonth() + 1);

            if (events.length <= 0) {
                var event = new Event();
                event.name = name;
                event.detail = {};

                event.detail[year] = {};
                event.detail[year][month] = 1;

                event.save(function(err) {
                    if (err) {
                        return next(err);
                    }

                    return res.status(200).send();
                });
            } else {
                var key = 'detail.' + year + '.' + month;
                var obj = {};

                obj[key] = 1;

                Event.update({ name: name }, { $inc: obj }, function(err) {
                    if (err) {
                        return next(err);
                    }

                    return res.status(200).send();
                });
            }
        });
});

module.exports = router;