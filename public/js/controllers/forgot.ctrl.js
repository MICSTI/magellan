'use strict';

angular
    .module('magellan')
    .controller('ForgotCtrl', function($scope, UserSrv, LogSrv, FocusSrv) {
        $scope.passObj = {};
        $scope.message = {};

        var forgotPassword = function() {
            if (!$scope.passObj.email) {
                setMessage('error', 'Alle Felder müssen ausgefüllt sein');
                return;
            }

            UserSrv.forgotPassword({
                email: $scope.passObj.email
            }).then(function(data) {
                var validity = data.valid;

                var validText = validity !== undefined ? " Der Link ist " + validity + " lang Stunden gültig." : "";

                setMessage('success', 'Das E-Mail wurde erfolgreich versandt.' + validText);
            }).catch(function(err) {
                if (err.message === "No user with this e-mail address found") {
                    setMessage('error', 'Es wurde kein Benutzer mit dieser E-Mail-Adresse gefunden');
                } else {
                    setMessage('error', 'Beim Versenden des Links ist etwas schiefgegangen');
                }
            });
        };

        var delegateSubmit = function() {
            forgotPassword();
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

        FocusSrv('#email');

        $scope.forgotPassword = forgotPassword;
        $scope.delegateSubmit = delegateSubmit;
    });