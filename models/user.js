var db = require('../db');

var User = db.model('User', {
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    displayName: {
        type: String
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    signupToken: {
        type: String,
        select: false
    },
    tokenExpiration: {
        type: Date,
        select: false
    },
    confirmed: {
        type: Boolean,
        default: true,
        select: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

module.exports = User;