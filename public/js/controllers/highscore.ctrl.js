'use strict';

angular
    .module('magellan')
    .controller('HighscoreCtrl', function($scope, ScoreSrv, LogSrv) {
        $scope.scoreList = [];

        ScoreSrv.getHighscoreList()
            .then(function(list) {
                if ($scope.$$phase) {
                    $scope.scoreList = createRanking(list);
                } else {
                    $scope.$apply(function() {
                        $scope.scoreList = createRanking(list);
                    });
                }
            })
            .catch(function(err) {
                LogSrv.error(err);
            });

        var isMyself = function(id) {
            return $scope.user._id === id;
        };

        var createRanking = function(list) {
            var rank = 0;

            var previousScore = null;

            list.forEach(function(entry) {
                if (!previousScore || entry.score !== previousScore) {
                    rank++;

                    entry.rank = rank + '.';
                }

                previousScore = entry.score;
            });

            return list;
        };

        $scope.isMyself = isMyself;
    });