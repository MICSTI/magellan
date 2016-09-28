'use strict';

angular
    .module('magellan')
    .controller('QuizDirectiveController', function($scope, QuizSrv, LogSrv, FocusSrv, ngProgressFactory) {
        // Progress bar initialization
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setParent(document.getElementById('quiz-progress'));
        $scope.progressbar.setAbsolute();
        $scope.progressbar.setColor("#336e7b");

        $scope.isResultsPageVisible = false;
        $scope.achievements = [];

        $scope.answerInput = {};
        $scope.hint = null;

        // add options for multiplier selection
        $scope.multiplierOptions = [
            { value: 1, label: '' },
            { value: 1000, label: 'Tsd.'},
            { value: 1000000, label: 'Mio.'}
        ];

        var question = null;

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

        var submitAnswer = function() {
            if ($scope.answerInput.answer) {
                var answer = $scope.answerInput.answer;

                // if it is a number input, replace ',' with '.'
                if (question.getInfo().input && question.getInfo().input.indexOf('number') === 0) {
                    answer = answer.replace(',', '.');
                }

                // if a multiplier is available, calculate answer
                if ($scope.answerInput.multiplier) {
                    answer *= $scope.answerInput.multiplier.value;
                }

                LogSrv.info('submitting answer', answer);
                $scope.answerInput.points = question.answer(answer);

                // set focus to next question button
                FocusSrv('#btnNextQuestion');
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

        var parseEvents = function(events) {
            var achievements = [];

            if (events.indexOf('overall_best') >= 0) {
                achievements.push({
                    text: 'Du hast einen neuen absoluten Rekord geschafft!'
                });
            }

            if (events.indexOf('overall_best_equalised') >= 0) {
                achievements.push({
                    text: 'Du hast den aktuellen absoluten Rekord eingestellt!'
                });
            }

            if (events.indexOf('personal_best') >= 0) {
                achievements.push({
                    text: 'Du hast einen neuen persönlichen Rekord geschafft!'
                });
            }

            if (events.indexOf('personal_best_equalised') >= 0) {
                achievements.push({
                    text: 'Du hast gleich viele Punkte geschafft wie bei deinem persönlichen Rekord!'
                });
            }

            if (events.indexOf('new_daily_best') >= 0) {
                achievements.push({
                    text: 'Du hast einen neuen persönlichen Tagesrekord geschafft!'
                });
            }

            $scope.achievements = achievements;
        };

        var continueFinished = function() {
            showResultsPage();

            nextQuestion();

            // conclude the quiz and write result to database
            QuizSrv.conclude()
                .then(function(data) {
                    parseEvents(data.events || []);
                })
                .catch(function(err) {
                    LogSrv.error(err);
                });
        };

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
    });