var db = require('../db');

var User = db.model('User', {
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    color: {
        type: String
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    scores: [],
    resetToken: {
        type: String
    },
    resetTokenValid: {
        type: Date
    },
    emailUpdates: {
        type: Boolean,
        default: true
    },
    facebook: {
        type: String
    },
    google: {
        type: String
    }
});

module.exports = User;