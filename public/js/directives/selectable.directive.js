'use strict';

angular
    .module('magellan')
    .directive('selectable', function() {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/selectable.template.html',
            controller: 'SelectableCtrl',
            scope: {
                countryName: '@countryName',
                countryAlpha2: '@countryAlpha2'
            }
        }
    });