'use strict';

angular
    .module('magellan')
    .directive('valueRevealer', function($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/value-revealer.template.html',
            scope: {
                countryName: '@countryName',
                countryAlpha2: '@countryAlpha2',
                countryAlpha3: '@countryAlpha3',
                fillValue: '@fillValue',
                revealValue: '@revealValue'
            },
            link: function(scope, element, attrs) {
                // time after which value should be revealed
                var VALUE_REVEAL_DELAY = 1400;

                // track reveal state
                var revealing = false;
                var revealed = false;

                scope.getRevealed = function() {
                    return revealed;
                };

                scope.getRevealStyle = function() {
                    var width = revealing ? scope.fillValue : 0;

                    return {
                        'width': width + '%'
                    };
                };

                scope.$on('reset', function(event, data) {
                    revealing = false;
                    revealed = false;
                });

                scope.$on('reveal', function(event, data) {
                    revealing = true;

                    $timeout(function() {
                        // set revealed true when finished
                        revealed = true;
                    }, VALUE_REVEAL_DELAY);
                });
            }
        }
    });