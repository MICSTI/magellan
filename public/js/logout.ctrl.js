'use strict';

angular
    .module('magellan')
    .controller('LogoutCtrl', function($scope, UserSrv) {
        UserSrv.logout()
            .then(function() {
                // inform application control about login event
                $scope.$emit('app.logout');
            });
    });