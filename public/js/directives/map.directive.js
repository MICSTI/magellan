'use strict';

angular
    .module('magellan')
    .directive('map', function(CountrySrv) {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/map.template.html',
            link: function link(scope, element, attrs) {
                var map = new Datamap({
                    scope: 'world',
                    done: function() {
                        console.log('map has finished drawing');
                    },
                    element: document.getElementById('map-container'),
                    fills: {
                        defaultFill: '#22a7f0'
                    },
                    geographyConfig: {
                        highlightBorderColor: 'rgba(200, 247, 197, 0.4)',
                        highlightFillColor: '#019875',
                        highlightOnHover: true,
                        popupOnHover: true,
                        popupTemplate: function(geography, data) {
                            var country = CountrySrv.getCountryByAlpha3(geography.id);

                            var countryName = country ? country.name : geography.properties.name;

                            return '<div class="hoverinfo"><strong>' + countryName + '</strong></div>';
                        }
                    }
                });

                scope.zoomIn = function() {
                    console.log('zoom in');
                };

                scope.zoomOut = function() {
                    console.log('zoom out');
                }
            }
        }
    });
