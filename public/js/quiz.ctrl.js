'use strict';

angular
    .module('magellan')
    .controller('QuizCtrl', function($scope, QuizSrv, LogSrv) {
        var startQuiz = function() {
            QuizSrv.init()
                .then(function(quiz) {
                    LogSrv.logInfo("Quiz loaded", quiz.getQuestions());
                })
                .catch(function(err) {
                    LogSrv.logError(err);
                });
        };

        $scope.startQuiz = startQuiz;

        $scope.isQuizRunning = function() {
            return QuizSrv.isQuizRunning();
        };
    });