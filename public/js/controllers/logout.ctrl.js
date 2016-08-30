'use strict';

angular
    .module('magellan')
    .controller('LogoutCtrl', function($scope, UserSrv) {
        UserSrv.logout()
            .then(function() {
                // inform application control about logout event
                $scope.$emit('app.logout');
            });
    });