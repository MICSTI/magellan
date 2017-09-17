'use strict';

angular
    .module('magellan')
    .controller('ValueRevealerCtrl', function($scope, $timeout) {
        // time after which value should be revealed
        var VALUE_REVEAL_DELAY = 1400;

        // track reveal state
        var revealing = false;
        var revealed = false;

        $scope.getRevealed = function() {
            return revealed;
        };

        $scope.getRevealStyle = function() {
            var width = revealing ? $scope.fillValue : 0;

            return {
                'width': width + '%'
            };
        };

       $scope.$on('value-revealer.reveal', function(event, data) {
           revealing = true;

           $timeout(function() {
               // set revealed true when finished
               revealed = true;
           }, VALUE_REVEAL_DELAY);
       });
    });