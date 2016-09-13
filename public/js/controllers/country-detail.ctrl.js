'use strict';

angular
    .module('magellan')
    .controller('CountryDetailCtrl', function($scope, CountrySrv, $stateParams) {
        var alpha3Code = $stateParams.alpha3Code;

        if (CountrySrv.areCountriesLoaded()) {
            $scope.country = CountrySrv.getCountryByAlpha3(alpha3Code);
        }

        $scope.$on('countries.loaded', function() {
            $scope.$apply(function() {
                $scope.country = CountrySrv.getCountryByAlpha3(alpha3Code);
            })
        });
    });