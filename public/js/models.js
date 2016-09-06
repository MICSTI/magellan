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
    var text = null;
    var type = null;
    var answer = null;
    var hints = null;

    var answered = false;

    var init = function(opts) {
        text = opts.text;
        type = opts.type;

        if (typeof opts.answer == 'string') {
            answer = {
                correct: opts.answer,
                altSpellings: []
            }
        } else {
            answer = {};

            answer.correct = opts.answer.correct;

            answer.altSpellings = opts.answer.altSpellings !== undefined ? opts.answer.altSpellings : [];
        }
    };

    var checkAnswer = function(submitted) {
        var status = {};

        switch(typeof submitted) {
            case 'string':
                status["correct"] = submitted === answer.correct || answer.altSpellings.indexOf(submitted) > 0;

                break;

            default:
                break;
        }

        return status;
    };

    if (options) {
        init(options);
    }

    this.config = function(opts) {
        init(opts);
    };

    /**
     * Returns the question text.
     */
    this.question = function() {
        return text;
    };

    /**
     * Returns the question type.
     */
    this.type = function() {
        return type;
    };

    /**
     * Returns the correct answer to the question after the question has been answered.
     * If the question has not been answered yet, it returns null.
     */
    this.solution = function() {
        if (answered) {
            return answer.correct;
        }

        return null;
    };

    /**
     * Submits an answer to the question.
     * If the question has already been answered, this method does nothing.
     */
    this.answer = function(answer) {
        if (answered) {
            return;
        }

        answered = true;

        return checkAnswer(answer);
    };

    /**
     * Returns the state of the question.
     */
    this.answered = function() {
        return answered;
    };
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

if (module && module.exports) {
    module.exports.Question = Question;
}