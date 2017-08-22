'use strict';

angular
    .module('magellan')
    .directive('valueRevealer', function() {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/value-revealer.template.html',
            controller: 'ValueRevealerCtrl',
            scope: {
                countryName: '@countryName',
                countryAlpha2: '@countryAlpha2',
                fillValue: '@fillValue',
                revealValue: '@revealValue'
            }
        }
    });