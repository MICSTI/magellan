'use strict';

angular
    .module('magellan')
    .controller('ForgotCtrl', function($scope, UserSrv, LogSrv, FocusSrv, ToastSrv, $timeout) {
        $scope.passObj = {};

        /**
         * This is necessary because otherwise the CSS transitions of the toast won't work (is it a problem with the promise?)
         * Anyway, this works.
         */
        var showToastDelayed = function(type, message) {
            $timeout(function() {
                ToastSrv.long(type, message);
            }, 50);
        };

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

                //ToastSrv.long('success', 'Das E-Mail wurde erfolgreich versandt.' + validText);
            }).catch(function(err) {
                if (err.message === "No user with this e-mail address found") {
                    // This is intentional so as not to reveal too much to the user
                    showToastDelayed('error', 'Beim Versenden des Links ist etwas schiefgegangen');
                } else {
                    showToastDelayed('error', 'Beim Versenden des Links ist etwas schiefgegangen');
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