'use strict';

angular
    .module('magellan')
    .controller('QuizDirectiveController', function($scope, QuizSrv, LogSrv, FocusSrv, ngProgressFactory) {
        // Progress bar initialization
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setParent(document.getElementById('quiz-progress'));
        $scope.progressbar.setAbsolute();
        $scope.progressbar.setColor("#336e7b");

        $scope.answerInput = {};

        var question = null;

        var updateUi = function() {
            // get current question from quiz service
            question = QuizSrv.getCurrentQuestion();

            // update progress bar
            updateProgressBar();

            // focus answer input
            FocusSrv('.answerInput');
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

        var submitAnswer = function() {
            if ($scope.answerInput.answer) {
                console.log(question.answer($scope.answerInput.answer));

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

        // initially update UI
        updateUi();

        $scope.getQuestion = getQuestion;
        $scope.getCurrentQuestionNumber = getCurrentQuestionNumber;
        $scope.renderQuestionText = renderQuestionText;
        $scope.submitAnswer = submitAnswer;
        $scope.questionAnswered = questionAnswered;
        $scope.nextQuestion = nextQuestion;
        $scope.handleKeyPress = handleKeyPress;
    });