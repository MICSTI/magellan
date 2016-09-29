'use strict';

angular
    .module('magellan')
    .controller('CountryDifficultyCtrl', function($scope, CountrySrv) {
        var init = function() {
            var countries = CountrySrv.getCountries();
            var difficulties = {
                'easy': [],
                'medium': [],
                'hard': [],
                'unassigned': []
            };

            // determine difficulty
            countries.sort(function(a, b) {
                return b.population - a.population;
            }).forEach(function(c) {
                if (c.subregion.indexOf('Europe') >= 0 ||
                    c.subregion.indexOf('Australia and New Zealand') >= 0 ||
                    (c.subregion.indexOf('South America') >= 0 && c.population >= 25000000) ||
                    c.subregion.indexOf('Northern America') >= 0 ||
                    (c.subregion.indexOf('Central America') >= 0 && c.population >= 100000000) ||
                    (c.subregion.indexOf('Africa') >= 0 && c.population >= 100000000) ||
                    (c.subregion.indexOf('Asia') >= 0 && c.population >= 500000000) ||
                    c.name === 'Türkei') {
                    // easy
                    c.difficulty = 'easy';
                } else if ((c.subregion.indexOf('Africa') >= 0 && c.population >= 15000000) ||
                            (c.subregion.indexOf('Asia') >= 0 && c.population >= 10000000)  ||
                            (c.subregion.indexOf('South America') >= 0 && c.population >= 1000000) ||
                            (c.subregion.indexOf('Central America') >= 0 && c.population >= 10000000) ||
                            (c.subregion.indexOf('Caribbean') >= 0 && c.population >= 1000000) ||
                            ['Tunesien', 'Aserbaidschan', 'Vereinigte Arabische Emirate', 'Georgien', 'Armenien'].indexOf(c.name) >= 0) {
                    // medium
                    c.difficulty = 'medium';
                } else if ((c.subregion.indexOf('South America') >= 0 && c.population < 1000000) ||
                            (c.subregion.indexOf('Africa') >= 0 && c.population < 15000000) ||
                            (c.subregion.indexOf('Asia') >= 0 && c.population < 10000000) ||
                            (c.subregion.indexOf('Central America') >= 0 && c.population < 10000000) ||
                            (c.subregion.indexOf('Caribbean') >= 0 && c.population < 1000000) ||
                            (c.region.indexOf('Oceania') >= 0 && c.subregion !== 'Australia and New Zealand')) {
                    // hard
                    c.difficulty = 'hard';
                } else {
                    // unassigned
                    c.difficulty = 'unassigned';
                }

                difficulties[c.difficulty].push(c);
            });

            if ($scope.$$phase) {
                $scope.difficulties = difficulties;
                $scope.difficultyKeys = Object.keys(difficulties);
            } else {
                $scope.$apply(function() {
                    $scope.difficulties = difficulties;
                    $scope.difficultyKeys = Object.keys(difficulties);
                });
            }
        };

        if (CountrySrv.areCountriesLoaded()) {
            init();
        }

        $scope.$on('countries.loaded', function(event, data) {
            init();
        });
    });