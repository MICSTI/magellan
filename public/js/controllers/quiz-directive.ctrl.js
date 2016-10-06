
'use strict';

angular
    .module('magellan')
    .controller('QuizDirectiveController', function($scope, QuizSrv, LogSrv, FocusSrv, ngProgressFactory, $filter) {
        var question;

        var initCtrl = function() {
            // Progress bar initialization
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.progressbar.setParent(document.getElementById('quiz-progress'));
            $scope.progressbar.setAbsolute();
            $scope.progressbar.setColor("#336e7b");

            $scope.isResultsPageVisible = false;
            $scope.achievements = [];
            $scope.bests = [];

            $scope.answerInput = {};
            $scope.hint = null;

            // add options for multiplier selection
            $scope.multiplierOptions = [
                { value: 1, label: '' },
                { value: 1000, label: 'Tsd.'},
                { value: 1000000, label: 'Mio.'}
            ];

            question = null;
        };

        var updateUi = function() {
            // get current question from quiz service
            question = QuizSrv.getCurrentQuestion();

            // delete previous hints
            $scope.hint = null;

            if (question !== null) {
                // multipliers for questions containing numbers
                if (question.getInfo().input && question.getInfo().input.indexOf('number') === 0) {
                    switch (question.getInfo().input) {
                        case 'number.high':
                            $scope.answerInput.multiplier = { value: 1000000, label: 'Mio.'};
                            break;

                        case 'number.medium':
                            $scope.answerInput.multiplier = { value: 1000, label: 'Tsd.'};
                            break;

                        default:
                            $scope.answerInput.multiplier = { value: 1, label: '' };
                            break;
                    }
                } else {
                    $scope.answerInput.multiplier = null;
                }

                // update progress bar
                updateProgressBar();

                // focus answer input
                FocusSrv('.answerInput');
            } else {
                // quiz has ended, set progress bar to 0
                $scope.progressbar.set(0);
            }
        };

        var getQuestion = function() {
            return question;
        };

        var getCurrentQuestionNumber = function() {
            return QuizSrv.getCurrentQuestionNumber();
        };

        var getNumberOfQuizQuestions = function() {
            return QuizSrv.getNumberOfQuizQuestions();
        };

        var renderQuestionText = function() {
            return render(getQuestion().question(), 'question-highlight') + '?';
        };

        var getQuestionMedia = function() {
            if (!question || !question.getInfo().media)
                return null;

            return question.getInfo().media;
        };

        var showResultsPage = function() {
            $scope.isResultsPageVisible = true;
        };

        var hideResultsPage = function() {
            if ($scope.$$phase) {
                $scope.isResultsPageVisible = false;
            } else {
                $scope.$apply(function() {
                    $scope.isResultsPageVisible = false;
                });
            }
        };

        var hintsAvailable = function() {
            if (question === null) {
                return false;
            }

            if (question.hintsRemaining() === null) {
                return false;
            }

            return question.hintsRemaining() > 0;
        };

        var submitAnswer = function() {
            if ($scope.answerInput.answer && !question.answered()) {
                var answer = String($scope.answerInput.answer);

                // if it is a number input, replace ',' with '.'
                if (question.getInfo().input && question.getInfo().input.indexOf('number') === 0) {
                    answer = answer.replace(',', '.');
                }

                // if a multiplier is available, calculate answer
                if ($scope.answerInput.multiplier) {
                    answer *= $scope.answerInput.multiplier.value;
                }

                $scope.answerInput.points = question.answer(answer);

                // set focus
                if (!wasLastQuestion()) {
                    FocusSrv('#btnNextQuestion');
                } else {
                    FocusSrv('#btnContinueFinished  ');
                }
            }
        };

        var questionAnswered = function() {
            if (!QuizSrv.isQuizRunning() || question === null) {
                return false;
            }

            return question.answered();
        };

        var nextQuestion = function() {
            QuizSrv.nextQuestion();

            $scope.answerInput.answer = "";

            updateUi();
        };

        var requestHint = function() {
            $scope.hint = question.hint();

            FocusSrv('.answerInput');
        };

        var render = function(text, className) {
            return text
                .replace("[", "<span class='" + className + "'>")
                .replace("]", "</span>");
        };

        var handleKeyPress = function(keyEvent) {
            if (keyEvent.which == 13) {
                submitAnswer();
            }
        };

        var updateProgressBar = function() {
            var progressPercent = getCurrentQuestionNumber() / getNumberOfQuizQuestions() * 100;

            $scope.progressbar.set(progressPercent);
        };

        var wasLastQuestion = function() {
            return getCurrentQuestionNumber() >= getNumberOfQuizQuestions();
        };

        var parseEvents = function(events, personalBest, overallBest) {
            var achievements = [];

            var showBests = true;

            if (events.indexOf('overall_best') >= 0) {
                achievements.push({
                    text: 'Du hast einen neuen absoluten Rekord geschafft!'
                });

                showBests = false;
            }

            if (events.indexOf('overall_best_equalised') >= 0) {
                achievements.push({
                    text: 'Du hast den aktuellen absoluten Rekord eingestellt!'
                });

                showBests = false;
            }

            if (events.indexOf('personal_best') >= 0 && events.indexOf('overall_best') < 0) {
                achievements.push({
                    text: 'Du hast einen neuen persönlichen Rekord geschafft!'
                });

                showBests = false;
            }

            if (events.indexOf('personal_best_equalised') >= 0 && events.indexOf('overall_best_equalised') < 0) {
                achievements.push({
                    text: 'Du hast gleich viele Punkte geschafft wie bei deinem persönlichen Rekord!'
                });

                showBests = false;
            }

            if (events.indexOf('new_daily_best') >= 0 && achievements.length === 0) {
                achievements.push({
                    text: 'Du hast einen neuen persönlichen Tagesrekord geschafft!'
                });
            }

            if ($scope.$$phase) {
                $scope.achievements = achievements;
            } else {
                $scope.$apply(function() {
                    $scope.achievements = achievements;
                });
            }

            if (showBests && personalBest && personalBest.id && personalBest.date && personalBest.score && overallBest && overallBest.id && overallBest.date && overallBest.score) {
                var bests = [];

                overallBest.type = 'overall';
                bests.push(overallBest);

                if (personalBest.id !== overallBest.id) {
                    personalBest.type = 'personal';

                    bests.push(personalBest);
                }

                if ($scope.$$phase) {
                    $scope.bests = bests;
                } else {
                    $scope.$apply(function() {
                        $scope.bests = bests;
                    });
                }
            } else {
                if ($scope.$$phase) {
                    $scope.bests = null;
                } else {
                    $scope.$apply(function() {
                        $scope.bests = null;
                    });
                }
            }
        };

        var continueFinished = function() {
            showResultsPage();

            nextQuestion();

            // conclude the quiz and write result to database
            QuizSrv.conclude()
                .then(function(data) {
                    parseEvents(data.events || [], data.personalBest, data.overallBest);
                })
                .catch(function(err) {
                    LogSrv.error(err);
                });
        };

        var getBestText = function(best) {
            var text;

            if (best.type === 'personal') {
                // personal best
                text = "Dein persönlicher Rekord liegt bei <span class='bold'>{POINTS} Punkten</span>, aufgestellt am {DATE}.";
            } else {
                // overall best
                var fromMyself = best.id === $scope.user._id;

                if (fromMyself) {
                    text = "Du hältst den absoluten Rekord mit <span class='bold'>{POINTS} Punkten</span>, aufgestellt am {DATE}.";
                } else {
                    text = "<span class='highlight'>{USERNAME}</span> hält den absoluten Rekord mit <span class='bold'>{POINTS} Punkten</span>, aufgestellt am {DATE}.";
                }
            }

            return text.replace('{POINTS}', $filter('number')(best.score))
                .replace('{DATE}', getFormattedDate(best.date))
                .replace('{USERNAME}', best.username);
        };

        var getFormattedDate = function(date) {
            date = new Date(date);

            return pad(date.getDate(), '00') + '.' + pad(date.getMonth() + 1, '00') + '.' + (date.getYear() + 1900);
        };

        var pad = function(str, padValue) {
            return String(padValue + str).slice(-padValue.length);
        };

        var restartQuiz = function() {
            quiz = null;

            $scope.$emit('quiz.restart');

            initCtrl();

            updateUi();
        };

        var enterListener = function(keyPress, func) {
            if (keyPress.which == 13) {
                switch (func) {
                    case 'next_question':
                        nextQuestion();
                        break;

                    case 'continue_finished':
                        continueFinished();
                        break;

                    default:
                        break;
                }
            }
        };

        $scope.$on('quiz.start', function(event, data) {
            hideResultsPage();
        });

        $scope.$on('$destroy', function(event, data) {
            // controller is being destroyed (i.e. user leaves the page, so we tell the quiz service to dispose of the quiz object
            if (QuizSrv.hasQuizStarted() && QuizSrv.hasQuizEnded()) {
                QuizSrv.dispose();
            }
        });

        // init controller
        initCtrl();

        // initially update UI
        updateUi();

        $scope.getQuestion = getQuestion;
        $scope.getCurrentQuestionNumber = getCurrentQuestionNumber;
        $scope.renderQuestionText = renderQuestionText;
        $scope.submitAnswer = submitAnswer;
        $scope.questionAnswered = questionAnswered;
        $scope.nextQuestion = nextQuestion;
        $scope.handleKeyPress = handleKeyPress;
        $scope.getQuestionMedia = getQuestionMedia;
        $scope.requestHint = requestHint;
        $scope.wasLastQuestion = wasLastQuestion;
        $scope.continueFinished = continueFinished;
        $scope.getBestText = getBestText;
        $scope.restartQuiz = restartQuiz;
        $scope.hintsAvailable = hintsAvailable;
        $scope.enterListener = enterListener;
    });