'use strict';

angular
    .module('magellan')
    .controller('HomeCtrl', function($scope, LogSrv, $stateParams) {
        $scope.message = null;

        // check state params
        if ($stateParams.action) {
            var action = $stateParams.action;

            switch (action) {
                case 'register.successful':
                    $scope.message = {
                        type: 'success',
                        text: 'Gratulation! Die Anmeldung war erfolgreich. Herzlich willkommen bei Magellan.'
                    };

                    break;

                default:
                    $scope.message = null;
            }
        }
    });