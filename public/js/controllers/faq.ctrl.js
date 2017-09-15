'use strict';

angular
    .module('magellan')
    .controller('FaqCtrl', function($scope, LogSrv, $stateParams, ToastSrv) {
        // check state params
        if ($stateParams.action) {
            var action = $stateParams.action;

            switch (action) {
                case 'register.successful':
                    ToastSrv.custom('success', 'Gratulation! Die Anmeldung war erfolgreich. Herzlich willkommen bei Magellan.', 7000);

                    break;

                default:
                    break;
            }
        }
    });