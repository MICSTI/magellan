'use strict';

angular
    .module('magellan')
    .controller('LoginCtrl', function($scope, FocusSrv) {
        $scope.login = function(username, password) {
            console.log("trying to log in");
        };

        // focus username field
        FocusSrv('username');
    });