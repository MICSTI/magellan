'use strict';

angular
    .module('magellan')
    .controller('QuizCtrl', function($scope, QuizSrv, LogSrv) {

        var startQuiz = function() {
            QuizSrv.init()
                .then(function() {
                    LogSrv.info("Quiz started");
                })
                .catch(function(err) {
                    LogSrv.error(err);
                });
        };

        var isQuizRunning = function() {
            return QuizSrv.isQuizRunning();
        };

        $scope.startQuiz = startQuiz;
        $scope.isQuizRunning = isQuizRunning;

    });