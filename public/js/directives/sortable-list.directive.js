'use strict';

angular
    .module('magellan')
    .directive('sortableList', function() {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/sortable-list.template.html',
            scope: {
                countries: '@'
            },
            link: function(scope, element, attrs) {
                scope.countries = [
                    { 'name': 'Australien', 'alpha2': 'au', 'fillValue': 73, 'revealValue': 1 },
                    { 'name': 'Österreich', 'alpha2': 'at', 'fillValue': 42, 'revealValue': 2 },
                    { 'name': 'Kroatien', 'alpha2': 'hr', 'fillValue': 12, 'revealValue': 3 },
                    { 'name': 'Vatikan', 'alpha2': 'va', 'fillValue': 8, 'revealValue': 4 }
                ];
            }
        }
    });