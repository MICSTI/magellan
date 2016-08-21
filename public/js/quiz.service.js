'use strict';

angular
    .module('magellan')
    .factory('QuizSrv', function(AppConfig, LogSrv) {
        var countries = null;

        // flag to indicate if a quiz is currently running
        var quizRunning = false;

        var init = function() {
            return new Promise(function(resolve, reject) {
                if (!countriesLoaded()) {
                    reject("Countries not loaded");
                }

                // set quiz running flag
                quizRunning = true;

                // create quiz object
                var quiz = new Quiz();

                for (var i = 0; i < AppConfig['quiz.questions.number']; i++) {
                    quiz.addQuestion(new Question({
                        country: getRandomCountry()
                    }));
                }

                resolve(quiz);
            });
        };

        var setCountries = function(_countries) {
            countries = _countries;
        };

        var getRandomCountry = function() {
            return countries[getRandomInt(0, countries.length - 1)];
        };

        var countriesLoaded = function() {
            return countries !== null && countries.length > 0;
        };

        var isQuizRunning = function() {
            return quizRunning;
        }

        return {
            init: init,
            setCountries: setCountries,
            isQuizRunning: isQuizRunning
        };
    });