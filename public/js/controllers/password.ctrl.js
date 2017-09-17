'use strict';

angular
    .module('magellan')
    .controller('PasswordCtrl', function($scope, UserSrv, LogSrv, FocusSrv, ToastSrv, $timeout) {
        $scope.passObj = {};

        $scope.userHasPassword = null;

        var setScopeProp = function(prop, value) {
            if ($scope.$$phase) {
                $scope[prop] = value;
            } else {
                $scope.$apply(function() {
                    $scope[prop] = value;
                });
            }
        };

        var checkIfUserHasPassword = function() {
            UserSrv.getUser()
                .then(function(response) {
                    var user = response.data;

                    var hasPassword = user && user.hasPassword !== undefined ? user.hasPassword : null;

                    setScopeProp('userHasPassword', hasPassword);

                    $timeout(function() {
                        FocusSrv('#password-current');
                    }, 30);
                })
                .catch(function(err) {
                    console.error(err);
                    ToastSrv.long('error', 'Ein Fehler ist aufgetreten');
                });
        };

        var updatePassword = function() {
            if (!$scope.passObj.old || !$scope.passObj.new || !$scope.passObj.confirmation) {
                ToastSrv.short('error', 'Alle Felder müssen ausgefüllt sein');

                return;
            }

            if ($scope.passObj.new !== $scope.passObj.confirmation) {
                ToastSrv.long('error', 'Die Passwörter stimmen nicht überein');

                return;
            }

            UserSrv.updatePassword({
                old: $scope.passObj.old,
                password: $scope.passObj.new
            }).then(function() {
                ToastSrv.long('success', 'Das neue Passwort wurde erfolgreich gespeichert');
            }).catch(function(err) {
                if (err.message === "Old password incorrect") {
                    ToastSrv.long('error', 'Das alte Passwort ist nicht korrekt');
                } else if (err.message === "Password does not match requirements") {
                    ToastSrv.long('error', 'Das Passwort entspricht nicht den Sicherheitsrichtlinien');
                } else {
                    ToastSrv.long('error', 'Das neue Passwort konnte nicht gespeichert werden');
                }
            });
        };

        var delegateSubmit = function() {
            updatePassword();
        };

        $scope.updatePassword = updatePassword;
        $scope.delegateSubmit = delegateSubmit;

        checkIfUserHasPassword();
    });