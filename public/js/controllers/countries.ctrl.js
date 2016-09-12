'use strict';

angular
    .module('magellan')
    .controller('CountriesCtrl', function($scope, CountrySrv) {
        var countriesByLetter = null;
        var countryKeys = null;

        var init = function() {
            countriesByLetter = CountrySrv.getCountriesByLetter();
            countryKeys = Object.keys(countriesByLetter);

            if (!$scope.$$phase) {
                $scope.$apply(function() {
                    $scope.countryKeys = countryKeys;
                    $scope.countriesByLetter = countriesByLetter;
                });
            } else {
                $scope.countryKeys = countryKeys;
                $scope.countriesByLetter = countriesByLetter;
            }
        };

        if (CountrySrv.areCountriesLoaded()) {
            init();
        }

        $scope.$on('countries.loaded', function()  {
            init();
        });
    });