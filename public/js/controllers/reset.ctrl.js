'use strict';

angular
    .module('magellan')
    .controller('ResetCtrl', function($scope, UserSrv, LogSrv, FocusSrv, $stateParams) {
        $scope.passObj = {};
        $scope.message = {};

        var token = $stateParams.token;

        var resetPassword = function() {
            if (!$scope.passObj.new || !$scope.passObj.confirmation) {
                setMessage('error', 'Alle Felder müssen ausgefüllt sein');
                return;
            }

            if ($scope.passObj.new !== $scope.passObj.confirmation) {
                setMessage('error', 'Die Passwörter stimmen nicht überein');
                return;
            }

            if (!token) {
                setMessage('error', 'Kein gültiger Zurücksetzen-Link');
                return;
            }

            UserSrv.resetPassword({
                token: token,
                password: $scope.passObj.new
            }).then(function(data) {
                setMessage('success', 'Das Passwort wurde erfolgreich gespeichert');
            }).catch(function(err) {
                if (err.message === "Invalid token") {
                    setMessage('error', 'Der Zurücksetzen-Link ist leider nicht mehr gültig');
                } else if (err.message === "Password does not match requirements") {
                    setMessage('error', 'Das Passwort entspricht nicht den Sicherheitsrichtlinien');
                } else {
                    setMessage('error', 'Das neue Passwort konnte nicht gespeichert werden');
                }
            });
        };

        var delegateSubmit = function() {
            resetPassword();
        };

        var setMessage = function(type, text) {
            if ($scope.$$phase) {
                $scope.message = {
                    type: type,
                    text: text
                };
            } else {
                $scope.$apply(function() {
                    $scope.message = {
                        type: type,
                        text: text
                    };
                });
            }
        }

        FocusSrv('#password-new');

        $scope.resetPassword = resetPassword;
        $scope.delegateSubmit = delegateSubmit;
    });