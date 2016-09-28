'use strict';

angular
    .module('magellan')
    .controller('HighscoreCtrl', function($scope, ScoreSrv, LogSrv) {
        $scope.scoreList = [];

        ScoreSrv.getHighscoreList()
            .then(function(list) {
                if ($scope.$$phase) {
                    $scope.scoreList = list;
                } else {
                    $scope.$apply(function() {
                        $scope.scoreList = list;
                    });
                }
            })
            .catch(function(err) {
                LogSrv.error(err);
            });

        var isMyself = function(id) {
            return $scope.user._id === id;
        };

        $scope.isMyself = isMyself;
    });