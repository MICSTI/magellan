// own classes and functions

// ---------- MAP ----------
var createMap = function() {
    var map = new Datamap({
        element: document.getElementById('map-container'),
        geographyConfig: {
            highlightOnHover: true,
            popupOnHover: false
        }
    });
};

// ---------- QUIZ ----------
var Quiz = function() {
    // index of current question
    var currentQuestionIdx = null;

    // array containing all questions
    var questions = [];

    /**
     * Starts the quiz.
     */
    this.start = function() {
        // check if quiz has questions
        if (questions.length <= 0)
            throw Error("Cannot start a quiz without questions");

        return this.nextQuestion();
    };

    this.isActive = function() {
        return this.hasStarted() && !this.hasEnded();
    };

    this.hasStarted = function() {
        return currentQuestionIdx !== null;
    };

    this.hasEnded = function() {
        return this.hasStarted() && currentQuestionIdx >= questions.length;
    };

    this.submitted = false;

    /**
     * Adds a new question to the quiz.
     * The parameter must be an question object.
     * If no question object is passed or an object with missing properties, an error is thrown.
     */
    this.addQuestion = function(question) {
        if (question === undefined)
            throw Error("No question object passed");

        var valid = true;

        // a question object must contain all these properties
        var necessaryProperties = ['config', 'hint', 'solution', 'answer', 'question', 'getInfo', 'info', 'points', 'answered', 'hintsAllowed', 'hintsRemaining'];

        necessaryProperties.forEach(function(property) {
            if (!question.hasOwnProperty(property)) {
                valid = false;
                throw new Error("Question must have property '" + property + "'");
            }
        });

        if (valid) {
            questions.push(question);
        }
    };

    /**
     * Returns the next question of the quiz.
     * If the quiz has ended, it returns nothing.
     */
    this.nextQuestion = function() {
        if (currentQuestionIdx === null) {
            currentQuestionIdx = 0;
        } else {
            currentQuestionIdx++;
        }

        if (this.hasEnded()) {
            return false;
        }

        return questions[currentQuestionIdx];
    };

    this.currentQuestion = function() {
        if (!this.isActive()) {
            return null;
        }

        return questions[currentQuestionIdx];
    };

    this.getTotalPoints = function () {
        if (!this.hasStarted()) {
            return null;
        }

        var totalPoints = 0;

        questions.forEach(function(question) {
            var points = question.points();

            if (points !== undefined) {
                totalPoints += points;
            }
        });

        return totalPoints;
    };

    this.getCurrentQuestionNumber = function() {
        if (currentQuestionIdx === null)
            return null;

        return currentQuestionIdx + 1;
    };

    this.getNumberOfQuestions = function() {
        return questions.length;
    };
};

// ---------- QUESTION ----------
var Question = function(options) {
    // Text of the question
    var text = null;

    // Info object for the question
    var info = null;

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
        info = opts.info || {};
        answer = opts.answer;
        checkAnswer = opts.checkAnswer || null;

        hints = opts.hints || {
                allowed: false,     // is a hint allowed?
                maximum: 0,         // maximum number of hints for this question (irrelevant if allowed is set to false)
                cost: 0,            // number of points subtracted per used hint (irrelevant if allowed is set to false)
                give: null          // lambda function to give a hint for a question
            };
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
     * Returns the question info object.
     * Acts as getter (with only one argument) and setter (with two arguments)
     */
    this.info = function(prop, value) {
        if (value !== undefined) {
            // setter
            info[prop] = value;
        } else {
            // getter
            return info[prop];
        }
    };

    /**
     * Returns the entire info object.
     */
    this.getInfo = function() {
        return info;
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
     * Returns a hint for the question.
     * If no hints are allowed, or the maximum number of hints have been used, null is returned.
     */
    this.hint = function() {
        if (!hints.allowed) {
            return null;
        }

        if (hints.allowed && !hints.give) {
            throw new Error("Hints allowed but no give method passed");
        }

        if (hintsUsed < hints.maximum) {
            hintsUsed++;
        }

        return hints.give(hintsUsed, answer);
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
        points = checkAnswer(answer, submittedAnswer, hintsUsed, hints.cost, info);

        // ensure that no negative points are awarded
        points = Math.max(0, points);

        // ensure that only integer values are saved
        points = Math.floor(points);

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

    /**
     * Returns true if hints are allowed for this question, false if not.
     * If hints have not been initialized yet, null is returned.
     */
    this.hintsAllowed = function() {
        if (hints !== null) {
            return hints.allowed;
        }

        return null;
    };

    /**
     * Returns the number of remaining hints.
     * If no hints are allowed for this question, null is returned.
     */
    this.hintsRemaining = function() {
        var allowed = this.hintsAllowed();

        if (allowed === null || allowed === false) {
            return null;
        }

        return hints.maximum - hintsUsed;
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

// ---------- PASSWORD REQUIREMENTS VALIDATOR ----------
var PasswordRequirementsValidator = function() {
    var self = this;

    // default configuration
    var defaultConfig = {
        minLength: 8,
        maxLength: undefined,
        lowercaseChars: 1,
        uppercaseChars: 1,
        specialChars: 1,
        numberChars: 1
    };

    // used configuration
    var configuration = null;

    // password input
    this.input = null;

    this.check = function(_input) {
        // check if an input was passed
        if (typeof _input === 'undefined') {
            throw new Error('Missing mandatory input parameter');
        }

        // check if passed input is of type "string"
        if (typeof _input !== 'string') {
            throw new Error('First input parameter must be of type \"string\"');
        }

        // set input variable
        this.input = _input;

        // array containing all failed checks
        var failedChecks = [];

        // get all set config properties
        var configProperties = getConfigProperties();

        configProperties.forEach(function(configProp) {
            var result = performCheck(configProp);

            if (result !== true) {
                failedChecks.push(configProp);
            }

            console.log('CHECK for', configProp, 'is', result);
        });

        // return result
        return {
            passwordOk: failedChecks.length === 0,
            failedChecks: failedChecks
        };
    };

    this.setConfig = function(_config) {
        configuration = _config;
    };

    this.getConfig = function() {
        return configuration || defaultConfig;
    };

    var isConfigPropertySet = function(prop) {
        return typeof self.getConfig()[prop] !== 'undefined';
    };

    var getConfigProperties = function() {
        return Object.keys(self.getConfig());
    };

    var getConfigProperty = function(prop) {
        return self.getConfig()[prop];
    };

    var performCheck = function(prop) {
        if (typeof self.input !== 'string') {
            return false;
        }

        var propertyValue = getConfigProperty(prop);

        if (!propertyValue) {
            return true;
        }

        switch (prop) {
            case 'minLength':
                return self.input.length >= propertyValue;

                break;

            case 'maxLength':
                return self.input.length <= propertyValue;

                break;

            case 'lowercaseChars':
                var numLower = self.input.length - self.input.replace(/[a-z]/g, '').length;

                return numLower >= propertyValue;

                break;

            case 'uppercaseChars':
                var numUpper = self.input.length - self.input.replace(/[A-Z]/g, '').length;

                return numUpper >= propertyValue;

                break;

            case 'specialChars':
                var numSpecials = self.input.length - self.input.replace(/[!@§$%&#^*_:;.,+"'`´-]/g, '').length;

                return numSpecials >= propertyValue;

                break;

            case 'numberChars':
                var numNumbers = self.input.length - self.input.replace(/[0-9]/g, '').length;

                return numNumbers >= propertyValue;

                break;


            default:
                return undefined;
                break;
        }
    };
};

PasswordRequirementsValidator.CONFIG_PROPERTIES = [
    'minLength',        // minimum length of password
    'maxLength',        // maximum length of password (undefined for no maximum length)
    'lowercaseChars',   // number of mandatory lowercase characters
    'uppercaseChars',   // number of mandatory uppercase characters
    'specialChars',     // number of mandatory special characters
    'numberChars'       // number of mandatory number characters
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports.Question = Question;
    module.exports.Quiz = Quiz;
    module.exports.PasswordRequirementsValidator = PasswordRequirementsValidator;
}