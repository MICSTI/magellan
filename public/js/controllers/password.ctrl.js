'use strict';

angular
    .module('magellan')
    .controller('PasswordCtrl', function($scope, UserSrv, LogSrv, FocusSrv) {
        $scope.passObj = {};
        $scope.message = {};

        var updatePassword = function() {
            if (!$scope.passObj.old || !$scope.passObj.new || !$scope.passObj.confirmation) {
                setMessage('error', 'Alle Felder müssen ausgefüllt sein');

                return;
            }

            if ($scope.passObj.new !== $scope.passObj.confirmation) {
                setMessage('error', 'Die Passwörter stimmen nicht überein');

                return;
            }

            UserSrv.updatePassword({
                old: $scope.passObj.old,
                password: $scope.passObj.new
            }).then(function(data) {
                setMessage('success', 'Das neue Passwort wurde erfolgreich gespeichert');
            }).catch(function(err) {
                if (err.message === "Old password incorrect") {
                    setMessage('error', 'Das alte Passwort ist nicht korrekt');
                } else if (err.message === "Password does not match requirements") {
                    setMessage('error', 'Das Passwort entspricht nicht den Sicherheitsrichtlinien');
                } else {
                    setMessage('error', 'Das neue Passwort konnte nicht gespeichert werden');
                }
            });
        };

        var delegateSubmit = function() {
            updatePassword();
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

        FocusSrv('#password-current');

        $scope.updatePassword = updatePassword;
        $scope.delegateSubmit = delegateSubmit;
    });