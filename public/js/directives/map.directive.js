'use strict';

angular
    .module('magellan')
    .directive('map', function() {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/map.template.html',
            controller: 'MapCtrl',
            link: function link(scope, element, attrs) {
                var map = new Datamap({
                    element: document.getElementById('map-container'),
                    fills: {
                        defaultFill: '#22a7f0'
                    },
                    geographyConfig: {
                        highlightOnHover: true,
                        popuponHover: true,
                        highlightFillColor: '#019875',
                        highlightBorderColor: 'rgba(200, 247, 197, 0.4)'
                    }
                });
            }
        }
    })