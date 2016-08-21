'use strict';

angular
    .module('magellan')
    .factory('QuizSrv', function(AppConfig, LogSrv) {
        var countries = null;

        var quiz = null;
        var currentQuestionNo = null;

        var init = function() {
            return new Promise(function(resolve, reject) {
                if (!countriesLoaded()) {
                    reject("Countries not loaded");
                }

                if (quiz !== null && quiz.isActive() === true) {
                    reject("A quiz is currently being played");
                }

                // create quiz object
                quiz = new Quiz();

                for (var i = 0; i < AppConfig['quiz.questions.number']; i++) {
                    quiz.addQuestion(new Question({
                        country: getRandomCountry()
                    }));
                }

                currentQuestionNo = 0;

                resolve();
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
            return quiz !== null;
        };

        var getCurrentQuestion = function() {
            return quiz.getQuestions()[currentQuestionNo];
        };

        var getCurrentQuestionNumber = function() {
            return currentQuestionNo !== null ? currentQuestionNo + 1 : null;
        };

        var getNumberOfQuizQuestions = function() {
            return quiz !== null ? quiz.getQuestions().length : null;
        };

        var submitAnswer = function(answer) {
            var question = getCurrentQuestion();

            var correctAnswer = getAnswerToQuestion(question);

            question.state = answer === correctAnswer ? question.states.CORRECT : question.states.INCORRECT;
        };

        var getQuestionText = function() {
            var question = getCurrentQuestion();

            switch (question.type) {
                case question.types.CAPITAL_OF_COUNTRY:
                    return "Wie heißt die Hauptstadt von [" + question.country.translations.de || question.country.name + "]?";

                case question.types.COUNTRY_OF_CAPITAL:
                    return "[" + question.country.capital + "] ist die Hauptstadt von welchem Land?";

                default:
                    LogSrv.error("Unknown question type", question.type);
            }
        };

        var getAnswerToQuestion = function(question) {
            if (!question || !question.type) {
                return;
            }

            switch (question.type) {
                case question.types.CAPITAL_OF_COUNTRY:
                    return question.country.capital;

                case question.types.COUNTRY_OF_CAPITAL:
                    return question.country.translations.de || question.country.name;

                default:
                    LogSrv.error("Unknown question type", question.type);
                    return null;
            }
        };

        var getAnswerStatus = function() {
            var question = getCurrentQuestion();

            var state = question.state;

            switch (state) {
                case question.states.CORRECT:
                    return "correct";

                case question.states.INCORRECT:
                    return "incorrect";

                default:
                    return null;
            }
        };

        var questionAnswered = function() {
            var question = getCurrentQuestion();

            return question.state !== question.states.NOT_ANSWERED;
        };

        var getAnswerText = function() {
            var question = getCurrentQuestion();

            return "[" + getAnswerToQuestion(question) + "]";
        };

        var nextQuestion = function() {
            if (getCurrentQuestionNumber() + 1 <= getNumberOfQuizQuestions()) {
                currentQuestionNo++;
            }
        };

        return {
            init: init,
            setCountries: setCountries,
            isQuizRunning: isQuizRunning,
            getCurrentQuestionNumber: getCurrentQuestionNumber,
            getNumberOfQuizQuestions: getNumberOfQuizQuestions,
            getQuestionText: getQuestionText,
            getAnswerStatus: getAnswerStatus,
            getAnswerText: getAnswerText,
            submitAnswer: submitAnswer,
            questionAnswered: questionAnswered,
            nextQuestion: nextQuestion
        };
    });