'use strict';

angular
    .module('magellan')
    .controller('PasswordCtrl', function($scope, UserSrv, LogSrv, FocusSrv) {
        $scope.passObj = {};
        $scope.message = {};

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

        var setMessage = function(type, text) {
            setScopeProp('message', {
                type: type,
                text: text
            });
        };

        var checkIfUserHasPassword = function() {
            UserSrv.getUser()
                .then(function(response) {
                    var user = response.data;

                    var hasPassword = user && user.hasPassword !== undefined ? user.hasPassword : null;

                    setScopeProp('userHasPassword', hasPassword);
                })
                .catch(function(err) {
                    setMessage('error', 'Ein Fehler ist aufgetreten.');
                });
        };

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

        FocusSrv('#password-current');

        $scope.updatePassword = updatePassword;
        $scope.delegateSubmit = delegateSubmit;

        checkIfUserHasPassword();
    });