'use strict';

angular
    .module('magellan')
    .factory('QuizSrv', function(AppConfig, CountrySrv, ScoreSrv, EventSrv) {
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

                // add quiz start event
                EventSrv.add('quiz.start');

                resolve(quiz.start());
            });
        };

        var dispose = function() {
            quiz = null;
        };

        var isQuizRunning = function() {
            if (quiz === null)
                return false;

            return quiz.hasStarted() && !quiz.hasEnded();
        };

        var hasQuizStarted = function() {
            if (quiz === null)
                return false;

            return quiz.hasStarted();
        };

        var hasQuizEnded = function() {
            if (quiz === null)
                return false;

            return quiz.hasEnded();
        };

        var createQuiz = function(quizType) {
            switch (quizType) {
                case 'country':
                default:
                    return createCountryQuiz();
            }
        };

        var getRandomCountry = function() {
            return countries.length > 0 ? countries[getRandomInt(0, countries.length - 1)] : null;
        };

        var createBorderCountriesOfCountryQuestion = function(country) {
            // these are the actual border countries of the country (in an array)
            var borderCountries = country.borders || [];

            // as a first step, map the alpha3 strings to actual country objects
            borderCountries = borderCountries.map(function(c) {
                return CountrySrv.getCountryByAlpha3(c);
            });

            // these are the possible border countries (all border countries of the border countries)
            // in this array there are no correct solutions, just possible solutions
            var possibleWrongSolutions = [];

            // first get all border countries of the border countries
            borderCountries.forEach(function(borderCountry) {
                // iterate over all border countries of the border country
                var borderCountryBorderCountries = borderCountry.borders || [];

                // map the alpha3 string to actual country objects
                borderCountryBorderCountries = borderCountryBorderCountries.map(function(borderCountryAlpha3) {
                    return CountrySrv.getCountryByAlpha3(borderCountryAlpha3);
                });

                // add it to the possible solutions array if
                //   - it is NOT the country itself
                //   - it is NOT already in there
                //   - it is NOT an actual border country (thus a correct solution)
                borderCountryBorderCountries.forEach(function(bc) {
                    // in case a ghost country (undefined) is in the array, just skip it)
                    if (!bc) {
                        return;
                    }

                    // if it's the country itself, leave immediately
                    if (bc.alpha3Code === country.alpha3Code) {
                        return;
                    }

                    var shouldAdd = true;

                    possibleWrongSolutions.forEach(function(p) {
                        // if it is already in the possible wrong solutions, don't add it
                        if (bc.alpha3Code === p.alpha3Code) {
                            shouldAdd = false;
                        }
                    });

                    if (!shouldAdd) {
                        return;
                    }

                    borderCountries.forEach(function(b) {
                        // if it is already in the possible wrong solutions, don't add it
                        if (bc.alpha3Code === b.alpha3Code) {
                            shouldAdd = false;
                        }
                    });

                    if (shouldAdd === true) {
                        possibleWrongSolutions.push(bc);
                    }
                });
            });

            // add some random countries
            var entriesSoFar = borderCountries.length + possibleWrongSolutions.length;

            // get 4 random countries if there are not enough possible solutions yet
            // this is the case for island countries, for instance
            var numberOfRandomCountriesLeft = entriesSoFar < 3 ? 4 : 2;

            var randomCountries = [];

            while (numberOfRandomCountriesLeft > 0) {
                var candidate = getRandomCountry();

                var ok = true;

                borderCountries.forEach(function(c) {
                    if (c.alpha3Code === candidate.alpha3Code) {
                        ok = false;
                    }
                });

                if (ok) {
                    possibleWrongSolutions.forEach(function(c) {
                        if (c.alpha3Code === candidate.alpha3Code) {
                            ok = false;
                        }
                    });
                }

                if (ok) {
                    randomCountries.forEach(function(c) {
                        if (c.alpha3Code === candidate.alpha3Code) {
                            ok = false;
                        }
                    });
                }

                if (ok) {
                    randomCountries.push(candidate);
                    numberOfRandomCountriesLeft--;
                }
            }

            // add "correct" property to all countries
            borderCountries = borderCountries.map(function(item) {
                item['correct'] = true;

                return item;
            });

            possibleWrongSolutions = possibleWrongSolutions.map(function(item) {
                item['correct'] = false;

                return item;
            });

            randomCountries = randomCountries.map(function(item) {
                item['correct'] = false;

                return item;
            });

            // put all countries together in one array and shuffle it for good measure
            var finalArray = shuffle(borderCountries.concat(possibleWrongSolutions).concat(randomCountries));

            // now we pick 4 random elements from the final array - these are the possible answers to the question
            var possibleAnswers = [];

            while (possibleAnswers.length < 4) {
                var randomNumber = getRandomInt(0, finalArray.length - 1);

                var element = finalArray.splice(randomNumber, 1)[0];

                if (element) {
                    possibleAnswers.push(element);
                }
            }

            return {
                country: country,
                possibleAnswers: possibleAnswers
            };
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

            // there are five easy, five medium and five hard questions (later to be shuffled randomly)
            // the 16th and last question is always a hard one.

            var easyCountries = countries.filter(function(c) {
                return c.difficulty === 'easy';
            });

            var mediumCountries = countries.filter(function(c) {
                return c.difficulty === 'medium';
            });

            var hardCountries = countries.filter(function(c) {
                return c.difficulty === 'hard';
            });

            // select countries
            for (var i = 0; i < numberOfQuestions; i++) {
                var countryOk = false;
                var country;

                while (!countryOk) {
                    if (i < 5) {
                        country = easyCountries[getRandomInt(0, easyCountries.length - 1)];
                    } else if (i < 10) {
                        country = mediumCountries[getRandomInt(0, mediumCountries.length - 1)];
                    } else {
                        country = hardCountries[getRandomInt(0, hardCountries.length - 1)];
                    }

                    countryOk = selectedCountries.indexOf(country['alpha3Code']) < 0;
                }

                selectedCountries.push(country['alpha3Code']);
            }

            // shuffle array (-2 because we don't want to shuffle the last country (it has to stay in place)
            var arrayToShuffle = selectedCountries.splice(0, selectedCountries.length - 1);

            var shuffledArray = shuffle(arrayToShuffle);

            // add last question to shuffled array
            shuffledArray.push(selectedCountries[selectedCountries.length - 1]);

            // create question type array
            var questionTypeArray = [];

            for (var j = 0; j < numberOfQuestions; j++) {
                questionTypeArray.push(8);
                // TODO re-add before merging
                /*if (j < 3) {
                    questionTypeArray.push(1);
                } else if (j < 6) {
                    questionTypeArray.push(2);
                } else if (j < 9) {
                    questionTypeArray.push(3);
                } else if (j < 12) {
                    questionTypeArray.push(4);
                } else if (j < 15) {
                    questionTypeArray.push(5);
                } else {
                    // add one random question for the last one
                    questionTypeArray.push(getRandomInt(1, questionTypesLength));
                }*/
            }

            var shuffledQuestionTypeArray = shuffle(questionTypeArray);

            // create questions for quiz
            var qcnt = 0;
            shuffledArray.forEach(function(alpha3, idx) {
                qcnt++;

                var country = CountrySrv.getCountryByAlpha3(alpha3);

                var questionType = questionTypes[shuffledQuestionTypeArray[idx]];

                var text = getQuestionText(questionType, country);
                var info = {
                    type: questionType,
                    difficulty: country.difficulty,
                    input: getQuestionInput(questionType),
                    unit: getQuestionUnit(questionType)
                };
                var answer = getQuestionAnswer(questionType, country);
                var checkAnswer = getCheckAnswerLambda(questionType, fullPoints, lastQuestionBonus);
                var hints = getQuestionHints(questionType, hintMaximum, hintCost);

                // the last question is the bonus question
                if (qcnt >= numberOfQuestions) {
                    info['bonus'] = true;
                }

                // add info for flag of country
                if (questionType === 'FLAG_OF_COUNTRY') {
                    info.media = 'flag';
                    info.alpha2Code = country.alpha2Code.toLocaleLowerCase();
                }

                // add info for location of country
                if (questionType === 'LOCATION_OF_COUNTRY') {
                    info.media = 'map';
                    info.alpha2Code = country.alpha2Code.toLocaleLowerCase();
                }

                // add info for borders of country
                if (questionType === 'BORDER_COUNTRIES_OF_COUNTRY') {
                    var bcQuestion = createBorderCountriesOfCountryQuestion(country);
                    info.possibleAnswers = bcQuestion.possibleAnswers || null;
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
                    return "[" + country.capital + "] ist die Hauptstadt von welchem Land";

                case 'POPULATION_OF_COUNTRY':
                    return "Wie viele Menschen leben in [" + country.name + "]";

                case 'AREA_OF_COUNTRY':
                    return "Wie groß ist die Fläche von [" + country.name + "]";

                case 'FLAG_OF_COUNTRY':
                    return "Welches Land hat diese Flagge";

                case 'LOCATION_OF_COUNTRY':
                    return "Wo befindet sich [" + country.name + "]";

                case 'BORDER_COUNTRIES_OF_COUNTRY':
                    return "Welche dieser Länder grenzen an [" + country.name + "]";

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
                case 'FLAG_OF_COUNTRY':
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

                case 'LOCATION_OF_COUNTRY':
                    return {
                        correct: country.alpha2Code
                    };

                case 'BORDER_COUNTRIES_OF_COUNTRY':
                    return {
                        correct: country.borders
                    };

                default:
                    return "?"
            }
        };

        var getQuestionInput = function(type) {
            switch (type) {
                case 'POPULATION_OF_COUNTRY':
                    return 'number.high';

                case 'AREA_OF_COUNTRY':
                    return 'number.medium';

                case 'LOCATION_OF_COUNTRY':
                    return 'map.point';

                case 'BORDER_COUNTRIES_OF_COUNTRY':
                    return 'selectable';

                case 'CAPITAL_OF_COUNTRY':
                case 'COUNTRY_OF_CAPITAL':
                case 'FLAG_OF_COUNTRY':
                default:
                    return 'text.standard';
            }
        };

        var getQuestionUnit = function(type) {
            switch (type) {
                case 'AREA_OF_COUNTRY':
                    return 'km²';

                case 'POPULATION_OF_COUNTRY':
                    return 'Einwohner';

                default:
                    return null;
            }
        };

        var getCheckAnswerLambda = function(type, fullPoints, lastQuestionBonus) {
            switch (type) {
                case 'CAPITAL_OF_COUNTRY':
                case 'COUNTRY_OF_CAPITAL':
                case 'FLAG_OF_COUNTRY':
                case 'LOCATION_OF_COUNTRY':
                    return function(answer, submittedAnswer, hintsUsed, hintCost, info) {
                        var allowedSpellings;

                        // convert submitted answer to locale lowercase
                        submittedAnswer = submittedAnswer.toLocaleLowerCase();

                        if (answer.altSpellings && answer.altSpellings.length > 0) {
                            allowedSpellings = answer.altSpellings.map(function(spelling) {
                                return spelling.toLocaleLowerCase();
                            });
                        } else {
                            allowedSpellings = [];
                        }

                        var correct = submittedAnswer === answer.correct.toLocaleLowerCase() || (allowedSpellings && allowedSpellings.indexOf(submittedAnswer) >= 0);

                        var points = correct ? fullPoints : 0;

                        // if hints are allowed and have been used, subtract the points
                        if (hintsUsed > 0) {
                            points -= (hintsUsed * hintCost);
                        }

                        // bonus points for last question
                        if (info !== undefined && info.bonus !== undefined && info.bonus === true) {
                            points *= lastQuestionBonus;
                        }

                        return points;
                    };

                case 'POPULATION_OF_COUNTRY':
                case 'AREA_OF_COUNTRY':
                    return function(answer, submittedAnswer, hintsUsed, hintCost, info) {
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

                        // if hints are allowed and have been used, subtract the points
                        if (hintsUsed > 0) {
                            points -= (hintsUsed * hintCost);
                        }

                        // bonus points for last question
                        if (info !== undefined && info.bonus !== undefined && info.bonus === true) {
                            points *= lastQuestionBonus;
                        }

                        return points;
                    };

                case 'BORDER_COUNTRIES_OF_COUNTRY':
                    return function(answer, submittedAnswer, hintsUsed, hintCost, info) {
                        // beware: the answer (array of border countries) is not necessarily the correct answer
                        // for countries with many border countries, only a few selected countries will be in the possible answers
                        // so we have to check if ALL border countries from the provided selection have been selected
                        // and further, if no countries that are NOT actually border countries have been selected
                        // TODO implement
                        return 0;
                    };

                default:
                    return "?";
            }
        };

        var getQuestionHints = function(type, hintsPossible, hintCost) {
            switch (type) {
                case 'CAPITAL_OF_COUNTRY':
                case 'COUNTRY_OF_CAPITAL':
                case 'FLAG_OF_COUNTRY':
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
                case 'BORDER_COUNTRIES_OF_COUNTRY':
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

        var getTotalPoints = function() {
            if (quiz === null) {
                return null;
            }

            return quiz.getTotalPoints();
        };

        /**
         * Concludes the quiz and puts the score to the API endpoint.
         * Returns a promise.
         */
        var conclude = function() {
            return new Promise(function(resolve, reject) {
                if (quiz !== null && quiz.hasEnded()) {
                    if (quiz.submitted === true) {
                        reject('Quiz has already been submitted');
                    }

                    quiz.submitted = true;

                    ScoreSrv.putHighscore(quiz.getTotalPoints())
                        .then(function(data) {
                            // add quiz finish event
                            EventSrv.add('quiz.finish');

                            resolve(data);
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                } else {
                    reject('No quiz is currently running');
                }
            });
        };

        /**
         * Shuffles an array randomly
         * @param array     the array to be shuffled
         * @returns {*}     the shuffled array
         */
        var shuffle = function (array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        };

        return {
            init: init,
            setCountries: setCountries,
            isQuizRunning: isQuizRunning,
            hasQuizStarted: hasQuizStarted,
            hasQuizEnded: hasQuizEnded,
            getCurrentQuestionNumber: getCurrentQuestionNumber,
            getNumberOfQuizQuestions: getNumberOfQuizQuestions,
            getCurrentQuestion: getCurrentQuestion,
            nextQuestion: nextQuestion,
            getTotalPoints: getTotalPoints,
            conclude: conclude,
            dispose: dispose
        };
    });