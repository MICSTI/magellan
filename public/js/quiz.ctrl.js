'use strict';

angular
    .module('magellan')
    .controller('QuizCtrl', function($scope, QuizSrv, LogSrv, FocusSrv, ngProgressFactory) {

        // Progress bar initialization
        $scope.progressbar = ngProgressFactory.createInstance();

        // TODO add to parent?

        var startQuiz = function() {
            QuizSrv.init()
                .then(function() {
                    FocusSrv('answer');
                })
                .catch(function(err) {
                    LogSrv.error("Could not start quiz", err);
                });
        };

        var isQuizRunning = function() {
            return QuizSrv.isQuizRunning();
        };

        var getCurrentQuestionNumber = function() {
            return QuizSrv.getCurrentQuestionNumber();
        };

        var getNumberOfQuizQuestions = function() {
            return QuizSrv.getNumberOfQuizQuestions();
        };

        var getQuestionText = function() {
            return renderQuestion(QuizSrv.getQuestionText(), "question-highlight") + "?";
        };

        var getAnswerText = function() {
            return renderQuestion(QuizSrv.getAnswerText(), "answer-highlight-" + QuizSrv.getAnswerStatus());
        };

        var questionAnswered = function() {
            return QuizSrv.questionAnswered();
        }

        var renderQuestion = function(text, className) {
            return text
                .replace("[", "<span class='" + className + "'>")
                .replace("]", "</span>");
        };

        var submitAnswer = function(answer) {
            if (answer) {
                QuizSrv.submitAnswer(answer);
            }
        };

        var questionAnswered = function() {
            return QuizSrv.questionAnswered();
        };

        var nextQuestion = function() {
            $scope.qu.answer = "";

            QuizSrv.nextQuestion();

            // set progress bar
            $scope.progressbar.set(QuizSrv.getProgressPercentage() * 100);

            FocusSrv('answer');
        };

        var handleKeyPress = function(keyEvent) {
            if (keyEvent.which == 13) {
                submitAnswer($scope.qu.answer);
            }
        };

        $scope.startQuiz = startQuiz;
        $scope.isQuizRunning = isQuizRunning;
        $scope.getCurrentQuestionNumber = getCurrentQuestionNumber;
        $scope.getNumberOfQuizQuestions = getNumberOfQuizQuestions;
        $scope.getQuestionText = getQuestionText;
        $scope.getAnswerText = getAnswerText;
        $scope.submitAnswer = submitAnswer;
        $scope.questionAnswered = questionAnswered;
        $scope.nextQuestion = nextQuestion;
        $scope.handleKeyPress = handleKeyPress;

        $scope.qu = {
            answer: ""
        };

    });