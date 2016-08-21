var magellan = angular.module("magellan", [
    'ui.router'
], function config($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

// define application constants
magellan.constant("AppConfig", {
    "log.info": true,
    "log.error": true,

    "quiz.questions.number": 5
});

magellan.controller("AppCtrl", function($scope, $state, UserSrv, CountrySrv, QuizSrv) {
    // ----------- App config ------------
    $scope.app = {
        config: {
            title: "Magellan",
            subtitle: "Test your knowledge about the countries of our world",
            author: "Michael Stifter"
        }
    };

    // ----------- App initialization ------------
    UserSrv.getUserFromStorage()
        .then(function(user) {
            // store user object in scope
            $scope.user = user;

            // init country service
            CountrySrv.init()
                .then(function(countries) {
                    $scope.$broadcast('countries.loaded', countries);

                    // set countries in quiz service
                    QuizSrv.setCountries(countries);
                });
        })
        .catch(function(err) {
            // the only error that can occur is that there is no token in storage, we do not need to react to that
        });

    // ----------- Event handling ------------
    $scope.$on('app.login', function(event, data) {
        // store user object in scope
        $scope.user = data;

        // init country service
        CountrySrv.init()
            .then(function(countries) {
                $scope.$broadcast('countries.loaded', countries);

                // set countries in quiz service
                QuizSrv.setCountries(countries);
            });

        // go to quiz page
        $state.go('quiz');
    });

    $scope.$on('app.logout', function(event, data) {
        // remove user object from scope
        $scope.user = null;

        // go to home page
        $state.go('home');
    });
});

// own classes and functions

// ---------- QUIZ ----------
var Quiz = function() {
    // questions array
    var questions = [];

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
};

// ---------- QUESTION ----------
var Question = function(options) {
    options = options || {};

    this.type = options.type || this.getRandomType();
    this.country = options.country || null;
};

Question.prototype.types = {
    "CAPITAL_OF_COUNTRY": "capital-of-country",
    "COUNTRY_OF_CAPITAL": "country-of-capital"
};

Question.prototype.getRandomType = function() {
    var types = Object.keys(this.types);

    return types[getRandomInt(0, types.length - 1)];
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};