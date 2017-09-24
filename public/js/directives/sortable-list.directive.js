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
                    { 'name': 'Australien', 'alpha2': 'au', 'fillValue': 100, 'revealValue': 23781000 },
                    { 'name': 'Österreich', 'alpha2': 'at', 'fillValue': 36.2, 'revealValue': 8611000 },
                    { 'name': 'Kroatien', 'alpha2': 'hr', 'fillValue': 17.76, 'revealValue': 4224000 },
                    { 'name': 'Vatikan', 'alpha2': 'va', 'fillValue': 0.05, 'revealValue': 842 }
                ];
            }
        }
    });