'use strict';

angular
    .module('magellan')
    .directive('valueRevealer', function() {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/value-revealer.template.html',
            controller: 'ValueRevealerCtrl',
            link: function link(scope, element, attrs) {

            }
        }
    });