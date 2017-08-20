'use strict';

angular
    .module('magellan')
    .controller('ValueRevealerCtrl', function($scope) {
        // track reveal state
        var revealed = 0;

        var revealing = false;

        $scope.isRevealing = function() {
            return revealing;
        };

        $scope.getRevealed = function() {
            return revealed;
        };

        $scope.revealStyle = {
            'width': $scope.fillValue + '%'
        };
    });