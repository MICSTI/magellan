'use strict';

angular
    .module('magellan')
    .directive('selectable', function($compile) {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/selectable.template.html',
            scope: {
                countryName: '@countryName',
                countryAlpha2: '@countryAlpha2',
                isSelected: '=isSelected'
            },
            link: function(scope, element, attrs) {
                scope.toggleState = function() {
                    // toggle the "isSelected" flag
                    scope.isSelected = !scope.isSelected;

                    // set the attribute on the HTML element
                    attrs.$set('isSelected', scope.isSelected);
                };
            }
        }
    });