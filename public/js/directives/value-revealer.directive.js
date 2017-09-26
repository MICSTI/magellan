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
                fillValue: '@fillValue',
                revealValue: '@revealValue'
            },
            link: function(scope, element, attrs) {
                scope.countries = [
                    { 'name': 'Australien', 'alpha2': 'au', 'fillValue': 100, 'revealValue': 23781000 },
                    { 'name': 'Österreich', 'alpha2': 'at', 'fillValue': 36.2, 'revealValue': 8611000 },
                    { 'name': 'Kroatien', 'alpha2': 'hr', 'fillValue': 17.76, 'revealValue': 4224000 },
                    { 'name': 'Vatikan', 'alpha2': 'va', 'fillValue': 0.05, 'revealValue': 842 }
                ];

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