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
    // Text of the question
    var text = null;

    // Type of the question
    var type = null;

    // Answer of the question
    var answer = null;

    // Hints of the question
    var hints = null;
    var hintsUsed = 0;

    // Lambda function to determine the answer status of the question
    var checkAnswer = null;

    // Points awarded for the question
    var points = null;

    // Flag indicating whether question has already been answered
    var answered = false;

    var init = function(opts) {
        text = opts.text;
        type = opts.type;
        answer = opts.answer;
        hints = opts.hints || 0;
        checkAnswer = opts.checkAnswer || null;
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
            return answer;
        }

        return null;
    };

    /**
     * Submits an answer to the question.
     * If the question has already been answered or no checkAnswer lambda has been set, this method does nothing.
     */
    this.answer = function(submittedAnswer) {
        if (answered ||!checkAnswer) {
            return;
        }

        answered = true;

        // checkAnswer method should return the status results
        points = checkAnswer(answer, submittedAnswer, type, hintsUsed);

        return points;
    };

    this.points = function() {
        if (!answered || points === null) {
            return;
        }

        return points;
    }

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