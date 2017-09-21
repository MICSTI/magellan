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
                countryAlpha3: '@countryAlpha3',
                isSelected: '=isSelected'
            },
            link: function(scope, element, attrs) {
                var setRole = function() {
                    attrs.$set('role', 'checkbox');
                };

                var setAriaChecked = function() {
                    attrs.$set('ariaChecked', scope.isSelected);
                };

                scope.toggleState = function() {
                    // toggle the "isSelected" flag
                    scope.isSelected = !scope.isSelected;

                    // set the attribute on the HTML element
                    attrs.$set('isSelected', scope.isSelected);

                    // also set the aria checked attribute
                    setAriaChecked();
                };

                // initially set the aria attributes
                setRole();
                setAriaChecked();
            }
        }
    });