'use strict';

angular
    .module('magellan')
    .controller('SettingsCtrl', function($scope, AppConfig, FocusSrv) {
        // user colours
        var colors = AppConfig['settings.user.colors'];

        // user object
        $scope.userObj = {
            color: null
        };

        $scope.userColors = colors;

        var setColor = function(newColor) {
            $scope.userObj.color = newColor;
        };

        $scope.setColor = setColor;

        // focus username field
        FocusSrv('username');
    });