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
            question = QuizSrv.getCurrentQuestion();
        };

        var getQuestion = function() {
            return question;
        };

        var getCurrentQuestionNumber = function() {
            return QuizSrv.getCurrentQuestionNumber();
        };

        // initially update UI
        updateUi();

        $scope.getQuestion = getQuestion;
        $scope.getCurrentQuestionNumber = getCurrentQuestionNumber;
    });