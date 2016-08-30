'use strict';

angular
    .module('magellan')
    .controller('QuizCtrl', function($scope, QuizSrv, LogSrv, FocusSrv, ngProgressFactory) {

        // Progress bar initialization
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setParent(document.getElementById('quiz-progress'));
        $scope.progressbar.setAbsolute();
        $scope.progressbar.setColor("#336e7b");

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

                // set progress bar
                $scope.progressbar.set(QuizSrv.getProgressPercentage() * 100);

                // set focus to next question button
                FocusSrv('btnNextQuestion');
            }
        };

        var questionAnswered = function() {
            return QuizSrv.questionAnswered();
        };

        var nextQuestion = function() {
            $scope.qu.answer = "";

            QuizSrv.nextQuestion();

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