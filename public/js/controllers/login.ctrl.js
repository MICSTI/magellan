'use strict';

angular
    .module('magellan')
    .controller('LoginCtrl', function($scope, UserSrv, FocusSrv, ToastSrv) {
        $scope.login = function(username, password) {
            UserSrv.login(username, password)
                .then(function(response) {
                    // inform application control about login event
                    $scope.$emit('app.login', response.data);
                })
                .catch(function(err) {
                    console.error(err);

                    if (err.status === 401) {
                        ToastSrv.long('error', 'Falscher Benutzername oder Passwort');
                    } else {
                        ToastSrv.long('error', 'Beim Einloggen scheint etwas schief gegangen zu sein');
                    }
                });
        };

        // focus username field
        FocusSrv('#username');
    });