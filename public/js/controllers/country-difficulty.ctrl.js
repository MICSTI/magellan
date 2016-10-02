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