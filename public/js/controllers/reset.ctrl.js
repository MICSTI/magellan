'use strict';

angular
    .module('magellan')
    .controller('ResetCtrl', function($scope, UserSrv, LogSrv, FocusSrv, $stateParams, ToastSrv) {
        $scope.passObj = {};

        var token = $stateParams.token;

        var resetPassword = function() {
            if (!$scope.passObj.new || !$scope.passObj.confirmation) {
                ToastSrv.long('error', 'Alle Felder müssen ausgefüllt sein');
                return;
            }

            if ($scope.passObj.new !== $scope.passObj.confirmation) {
                ToastSrv.long('error', 'Die Passwörter stimmen nicht überein');
                return;
            }

            if (!token) {
                ToastSrv.long('error', 'Kein gültiger Zurücksetzen-Link');
                return;
            }

            UserSrv.resetPassword({
                token: token,
                password: $scope.passObj.new
            }).then(function() {
                ToastSrv.long('success', 'Das Passwort wurde erfolgreich gespeichert');
            }).catch(function(err) {
                if (err.message === "Invalid token") {
                    ToastSrv.long('error', 'Der Zurücksetzen-Link ist leider nicht mehr gültig');
                } else if (err.message === "Password does not match requirements") {
                    ToastSrv.long('error', 'Das Passwort entspricht nicht den Sicherheitsrichtlinien');
                } else {
                    ToastSrv.long('error', 'Das neue Passwort konnte nicht gespeichert werden');
                }
            });
        };

        var delegateSubmit = function() {
            resetPassword();
        };

        FocusSrv('#password-new');

        $scope.resetPassword = resetPassword;
        $scope.delegateSubmit = delegateSubmit;
    });