'use strict';

angular
    .module('magellan')
    .controller('SettingsCtrl', function($scope, AppConfig, FocusSrv) {
        // user colours
        var colors = AppConfig['settings.user.colors'];

        // user object
        $scope.userObj = {
            username: null,
            email: null,
            color: null
        };

        $scope.userColors = colors;

        var setColor = function(newColor) {
            $scope.userObj.color = newColor;
        };

        var updateUser = function() {
            // TODO persist user info

            // emit user update event
            $scope.$emit('user.update', {
                username: $scope.userObj.username,
                email: $scope.userObj.email,
                color: $scope.userObj.color
            });
        };

        $scope.setColor = setColor;
        $scope.updateUser = updateUser;

        // focus username field
        FocusSrv('username');
    });