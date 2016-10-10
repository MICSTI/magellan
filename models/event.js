var db = require('../db');

var Event = db.model('event', {
    name: {
        type: String,
        required: true
    },
    detail: {
        type: Object
    }
});

module.exports = Event;