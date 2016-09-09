'use strict';

angular
    .module('magellan')
    .factory('QuizSrv', function(AppConfig, CountrySrv, LogSrv) {
        var countries = null;
        var countriesByAlpha3 = null;

        var quiz = null;

        var setCountries = function(_countries) {
            countries = _countries;
        };

        var countriesLoaded = function() {
            return countries !== null && countries.length > 0;
        };

        var init = function() {
            return new Promise(function(resolve, reject) {
                if (!countriesLoaded) {
                    reject("Countries have not been loaded");
                }

                quiz = createQuiz('country');

                resolve(quiz.start());
            });
        };

        var isQuizRunning = function() {
            if (quiz === null)
                return false;

            return quiz.hasStarted();
        };

        var createQuiz = function(quizType) {
            switch (quizType) {
                case 'country':
                default:
                    return createCountryQuiz();
            }
        };

        var createCountryQuiz = function() {
            var countryQuiz = new Quiz();

            var fullPoints = 100;
            var hintMaximum = 3;
            var hintCost = 25;

            var lastQuestionBonus = 2.5;

            var questionTypes = AppConfig['quiz.country.types'];
            var questionTypesLength = Object.keys(questionTypes).length;

            // select countries for questions
            var selectedCountries = [];
            var numberOfQuestions = AppConfig['quiz.country.questions'];

            for (var i = 0; i < numberOfQuestions; i++) {
                var countryOk = false;

                while (!countryOk) {
                    var country = countries[getRandomInt(0, countries.length - 1)];

                    countryOk = selectedCountries.indexOf(country['alpha3Code']) < 0;
                }

                selectedCountries.push(country['alpha3Code']);
            }

            // create questions for quiz
            var qcnt = 0;
            selectedCountries.forEach(function(alpha3) {
                qcnt++;

                var country = CountrySrv.getCountryByAlpha3(alpha3);

                var questionType = questionTypes[getRandomInt(0, questionTypesLength - 1)];

                var text = getQuestionText(questionType, country);
                var info = {
                    type: questionType
                };
                var answer = getQuestionAnswer(questionType, country);
                var checkAnswer = getCheckAnswerLambda(questionType, fullPoints, lastQuestionBonus);
                var hints = getQuestionHints(questionType, hintMaximum, hintCost);

                // the last question is the bonus question
                if (qcnt >= numberOfQuestions) {
                    info['bonus'] = true;
                }

                countryQuiz.addQuestion(new Question({
                    text: text,
                    info: info,
                    answer: answer,
                    checkAnswer: checkAnswer,
                    hints: hints
                }));
            });

            return countryQuiz;
        };

        var getQuestionText = function(type, country) {
            switch (type) {
                case 'CAPITAL_OF_COUNTRY':
                    return "Wie heißt die Hauptstadt von [" + country.name + "]";

                case 'COUNTRY_OF_CAPITAL':
                    return "[" + country.capital + "] ist die Hauptstadt von welchem Land"

                case 'POPULATION_OF_COUNTRY':
                    return "Wie viele Menschen leben in [" + country.name + "]";

                case 'AREA_OF_COUNTRY':
                    return "Wie groß ist die Fläche von [" + country.name + "]";

                default:
                    return "?"
            }
        };

        var getQuestionAnswer = function(type, country) {
            switch (type) {
                case 'CAPITAL_OF_COUNTRY':
                    var altSpellings = country.altSpellings !== undefined && country.altSpellings['capital'] !== undefined ? country.altSpellings['capital'] : [];

                    return {
                        correct: country.capital,
                        altSpellings: altSpellings
                    };

                case 'COUNTRY_OF_CAPITAL':
                    var altSpellings = country.altSpellings !== undefined && country.altSpellings['name'] !== undefined ? country.altSpellings['name'] : [];

                    return {
                        correct: country.name,
                        altSpellings: altSpellings
                    };

                case 'POPULATION_OF_COUNTRY':
                    return {
                        correct: country.population
                    };

                case 'AREA_OF_COUNTRY':
                    return {
                        correct: country.area
                    };

                default:
                    return "?"
            }
        };

        var getCheckAnswerLambda = function(type, fullPoints, lastQuestionBonus) {
            switch (type) {
                case 'CAPITAL_OF_COUNTRY':
                case 'COUNTRY_OF_CAPITAL':
                    return function(answer, submittedAnswer, info) {
                        var correct = submittedAnswer === answer.correct || (answer.altSpellings && answer.altSpellings.indexOf(submittedAnswer) >= 0);

                        var points = correct ? fullPoints : 0;

                        if (info !== undefined && info.bonus !== undefined && info.bonus === true) {
                            points *= lastQuestionBonus;
                        }

                        return points;
                    };

                case 'POPULATION_OF_COUNTRY':
                case 'AREA_OF_COUNTRY':
                    return function(answer, submittedAnswer, info) {
                        // calculate percentage difference from correct answer
                        var errorPercentage = Math.abs(submittedAnswer - answer.correct) / answer.correct * 100;

                        var points;

                        if (errorPercentage <= 3) {
                            points = 100;
                        } else if (errorPercentage <= 6) {
                            points = 90;
                        } else if (errorPercentage <= 9) {
                            points = 80;
                        } else if (errorPercentage <= 12) {
                            points = 70;
                        } else if (errorPercentage <= 14) {
                            points = 60;
                        } else if (errorPercentage <= 16) {
                            points = 50;
                        } else if (errorPercentage <= 18) {
                            points = 40;
                        } else if (errorPercentage <= 20) {
                            points = 30;
                        } else if (errorPercentage <= 25) {
                            points = 20;
                        } else if (errorPercentage <= 30) {
                            points = 10;
                        } else {
                            points = 0;
                        }

                        if (info !== undefined && info.bonus !== undefined && info.bonus === true) {
                            points *= lastQuestionBonus;
                        }

                        return points;
                    };

                default:
                    return "?";
            }
        };

        var getQuestionHints = function(type, hintsPossible, hintCost) {
            switch (type) {
                case 'CAPITAL_OF_COUNTRY':
                case 'COUNTRY_OF_CAPITAL':
                    return {
                        allowed: true,
                        maximum: hintsPossible,
                        cost: hintCost,
                        give: function(hintsUsed, answer) {
                            return answer.correct.substr(0, hintsUsed);
                        }
                    };

                case 'POPULATION_OF_COUNTRY':
                case 'AREA_OF_COUNTRY':
                    return {
                        allowed: false
                    };

                default:
                    return "?";
            }
        };

        var getCurrentQuestionNumber = function() {
            if (!isQuizRunning())
                return null;

            return quiz.getCurrentQuestionNumber();
        };

        var getNumberOfQuizQuestions = function() {
            if (!isQuizRunning())
                return null;

            return quiz.getNumberOfQuestions();
        };

        var getCurrentQuestion = function() {
            if (!isQuizRunning())
                return null;

            return quiz.currentQuestion();
        };

        var nextQuestion = function() {
            if (!isQuizRunning()) {
                return;
            }

            quiz.nextQuestion();
        };

        return {
            init: init,
            setCountries: setCountries,
            isQuizRunning: isQuizRunning,
            getCurrentQuestionNumber: getCurrentQuestionNumber,
            getNumberOfQuizQuestions: getNumberOfQuizQuestions,
            getCurrentQuestion: getCurrentQuestion,
            nextQuestion: nextQuestion
        };
    });