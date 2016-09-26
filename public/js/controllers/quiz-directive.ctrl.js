'use strict';

angular
    .module('magellan')
    .controller('QuizDirectiveController', function($scope, QuizSrv, LogSrv, ngProgressFactory) {
        // Progress bar initialization
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setParent(document.getElementById('quiz-progress'));
        $scope.progressbar.setAbsolute();
        $scope.progressbar.setColor("#336e7b");

        var question = null;

        var updateUi = function() {
            // get current question from quiz service
            question = QuizSrv.getCurrentQuestion();

            // update progress bar
            updateProgressBar();
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

        var render = function(text, className) {
            return text
                .replace("[", "<span class='" + className + "'>")
                .replace("]", "</span>");
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
    });