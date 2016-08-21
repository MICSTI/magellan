// own classes and functions

// ---------- QUIZ ----------
var Quiz = function() {
    // questions array
    var questions = [];

    // flag indicating if quiz is currently active
    var active = true;

    /**
     * Adds a question to the questions array
     * @param question
     */
    this.addQuestion = function(question) {
        questions.push(question);
    };

    this.getQuestions = function() {
        return questions;
    };

    this.isActive = function() {
        return active;
    };
};

// ---------- QUESTION ----------
var Question = function(options) {
    options = options || {};

    this.type = options.type || this.getRandomType();
    this.country = options.country || null;
    this.state = options.state || this.states.NOT_ANSWERED;
};

Question.prototype.states = {
    "NOT_ANSWERED": 1,
    "CORRECT": 2,
    "INCORRECT": 3
};

Question.prototype.types = {
    "CAPITAL_OF_COUNTRY": "capital-of-country",
    "COUNTRY_OF_CAPITAL": "country-of-capital"
};

Question.prototype.getRandomType = function() {
    var types = Object.keys(this.types);

    return this.types[types[getRandomInt(0, types.length - 1)]];
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns the text between two delimiting text occurrences
 */
var getStringBetween = function(text, firstString, secondString) {
    var firstPos = text.indexOf(firstString);
    var secondPos = text.indexOf(secondString);

    if (firstPos >= 0 && secondPos >= 0 && secondPos > firstPos) {
        return text.substr(firstPos + 1, secondPos - firstPos - 1);
    }

    return null;
};
