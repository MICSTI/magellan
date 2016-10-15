'use strict';

angular
    .module('magellan')
    .directive('map', function() {
        return {
            restrict: 'E',
            templateUrl: 'build/views/templates/map.template.html',
            controller: 'MapCtrl',
            link: function link(scope, element, attrs) {
                var map = new Datamap({
                    element: document.getElementById('map-container'),
                    geographyConfig: {
                        highlightOnHover: true,
                        popuponHover: true
                    }
                });
            }
        }
    })