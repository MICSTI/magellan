    var db = require('../db');

var Country = db.model('Country', {
    name: {
        type: String,
        required: true
    }
});

module.exports = Country;