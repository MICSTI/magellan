'use strict';

angular
    .module('magellan')
    .controller('ForgotCtrl', function($scope, UserSrv, LogSrv, FocusSrv, ToastSrv) {
        $scope.passObj = {};

        var forgotPassword = function() {
            if (!$scope.passObj.email) {
                ToastSrv.long('error', 'Alle Felder müssen ausgefüllt sein');
                return;
            }

            UserSrv.forgotPassword({
                email: $scope.passObj.email
            }).then(function(data) {
                var validity = data.valid;

                var validText = validity !== undefined ? " Der Link ist " + validity + " Stunden lang gültig." : "";

                ToastSrv.long('success', 'Das E-Mail wurde erfolgreich versandt.' + validText);
            }).catch(function(err) {
                if (err.message === "No user with this e-mail address found") {
                    // This is intentional so as not to reveal too much to the user
                    ToastSrv.long('error', 'Beim Versenden des Links ist etwas schiefgegangen');
                } else {
                    ToastSrv.long('error', 'Beim Versenden des Links ist etwas schiefgegangen');
                }
            });
        };

        var delegateSubmit = function() {
            forgotPassword();
        };

        FocusSrv('#email');

        $scope.forgotPassword = forgotPassword;
        $scope.delegateSubmit = delegateSubmit;
    });