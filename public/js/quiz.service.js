'use strict';

angular
    .module('magellan')
    .factory('QuizSrv', function(LogSrv) {
        var countries = null;

        // flag to indicate if a quiz is currently running
        var quizRunning = false;

        var init = function() {
            if (!countriesLoaded()) {
                LogSrv.logError("Countries not loaded");
            }

            LogSrv.logInfo("Country", getRandomCountry());
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

        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * Using Math.round() will give you a non-uniform distribution!
         */
        var getRandomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        return {
            init: init,
            setCountries: setCountries,
            isQuizRunning: isQuizRunning()
        };
    });