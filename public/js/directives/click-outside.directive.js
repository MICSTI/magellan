'use strict';

angular
    .module('magellan')
    .directive('clickOutside', function($parse, $document, $rootScope) {
        return {
            restrict: 'A',
            link: function link(scope, element, attrs) {
                $document.bind('click', clickOutsideHandler);

                element.bind('remove', function() {
                    $document.unbind('click', clickOutsideHandler);
                });

                function clickOutsideHandler(event) {
                    event.stopPropagation();

                    var targetParents = $(event.target).parents();
                    var inside = targetParents.index($(element)) !== -1;
                    var on = event.target === element[0];
                    var outside = !inside && !on;

                    if (outside) {
                        $rootScope.$broadcast('click.outside', event);
                    }
                }
            }
        }
    })