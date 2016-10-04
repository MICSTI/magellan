'use strict';

angular
    .module('magellan')
    .controller('PasswordCtrl', function($scope, UserSrv, LogSrv, FocusSrv) {
        $scope.passObj = {};
        $scope.message = {};

        var updatePassword = function() {
            LogSrv.info('update password');

            if ($scope.passObj.new !== $scope.passObj.confirmation) {
                $scope.message = {
                    type: 'error',
                    text: 'Die Passwörter stimmen nicht überein'
                };

                return;
            }

            // TODO confirm old password is correct

            UserSrv.updatePassword({
                password: $scope.passObj.new
            }).then(function(data) {
                LogSrv.info('successfully updated password', data);
            }).catch(function(err) {
                LogSrv.error('failed to update password'. err);
            });
        };

        var delegateSubmit = function() {
            updatePassword();
        };

        FocusSrv('#password-current');

        $scope.updatePassword = updatePassword;
        $scope.delegateSubmit = delegateSubmit;
    });