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

        var hasQuizStarted = function() {
            return QuizSrv.hasQuizStarted();
        };

        var hasQuizEnded = function() {
            return QuizSrv.hasQuizEnded();
        };

        var getTotalPoints = function() {
            return QuizSrv.getTotalPoints();
        }

        $scope.startQuiz = startQuiz;
        $scope.isQuizRunning = isQuizRunning;
        $scope.hasQuizStarted = hasQuizStarted;
        $scope.hasQuizEnded = hasQuizEnded;
        $scope.getTotalPoints = getTotalPoints;
    });