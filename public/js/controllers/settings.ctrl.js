'use strict';

angular
    .module('magellan')
    .controller('SettingsCtrl', function($scope, AppConfig, FocusSrv, LogSrv) {
        var init = function() {
            $scope.message = null;

            // user colours
            var colors = AppConfig['settings.user.colors'];

            // user object
            $scope.userObj = {
                username: $scope.user.username,
                email: $scope.user.email,
                color: $scope.user.color
            };

            $scope.userColors = colors;

            var setColor = function(newColor) {
                $scope.userObj.color = newColor;
            };

            var updateUser = function() {
                // TODO persist user info

                // update user object
                $scope.user.username = $scope.userObj.username;
                $scope.user.email = $scope.userObj.email;
                $scope.user.color = $scope.userObj.color;
            };

            var delegateSubmit = function() {
                updateUser(true);
            };

            $scope.setColor = setColor;
            $scope.updateUser = updateUser;
            $scope.delegateSubmit = delegateSubmit;

            // focus username field
            FocusSrv('username');
        };

        if ($scope.user) {
            init();
        }

        // otherwise, wait for user.loaded event
        $scope.$on('user.loaded', function(event, data) {
            init();
        });
    });