'use strict';

angular
    .module('magellan')
    .controller('QuizCtrl', function($scope, QuizSrv, LogSrv) {

        var startQuiz = function(cb) {
            QuizSrv.init()
                .then(function() {
                    if (cb && typeof cb === 'function') {
                        cb();
                    }
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
        };

        $scope.$on('quiz.restart', function(event, data) {
            QuizSrv.dispose();

            startQuiz(function() {
                $scope.$broadcast('quiz.start');
            });
        });

        $scope.startQuiz = startQuiz;
        $scope.isQuizRunning = isQuizRunning;
        $scope.hasQuizStarted = hasQuizStarted;
        $scope.hasQuizEnded = hasQuizEnded;
        $scope.getTotalPoints = getTotalPoints;
    });