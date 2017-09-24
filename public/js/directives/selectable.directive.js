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

                var toggleState = function() {
                    // toggle the "isSelected" flag
                    scope.isSelected = !scope.isSelected;

                    // set the attribute on the HTML element
                    attrs.$set('isSelected', scope.isSelected);

                    // also set the aria checked attribute
                    setAriaChecked();
                };

                scope.toggleState = toggleState;

                // attach event listener (so the component can be informed how to reveal if the solution was correct or not)
                scope.$on('selectable_solution', function(event, dataArr) {
                    dataArr.forEach(function(item) {
                        // check if the event item is for our component
                        if (item.alpha3Code === scope.countryAlpha3) {
                            attrs.$set('answer-correct', item.correct);
                        }
                    });
                });

                // initially set the aria attributes
                setRole();
                setAriaChecked();

                // attach onclick listener to element
                var domElement = element[0];

                if (domElement) {
                    domElement.addEventListener('click', toggleState, false);
                }
            }
        }
    });