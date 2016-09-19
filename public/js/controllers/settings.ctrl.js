'use strict';

angular
    .module('magellan')
    .controller('SettingsCtrl', function($scope, AppConfig, FocusSrv) {
        // user colours
        var colors = AppConfig['settings.user.colors'];

        $scope.userColors = colors;

        // focus username field
        FocusSrv('username');
    });