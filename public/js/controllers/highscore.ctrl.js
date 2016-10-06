'use strict';

angular
    .module('magellan')
    .controller('HighscoreCtrl', function($scope, ScoreSrv, LogSrv) {
        $scope.scoreList = [];

        $scope.isDataLoading = true;

        ScoreSrv.getHighscoreList()
            .then(function(list) {
                if ($scope.$$phase) {
                    $scope.scoreList = createRanking(list);
                } else {
                    $scope.$apply(function() {
                        $scope.scoreList = createRanking(list);
                    });
                }

                setLoadingState(false);
            })
            .catch(function(err) {
                LogSrv.error(err);

                setLoadingState(false);
            });

        var setLoadingState = function(state) {
            if ($scope.$$phase) {
                $scope.isDataLoading = state;
            } else {
                $scope.$apply(function() {
                    $scope.isDataLoading = state;
                });
            }
        };

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