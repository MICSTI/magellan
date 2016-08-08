'use strict';

angular
    .module('magellan')
    .controller('LoginCtrl', function($scope, UserSrv, FocusSrv) {
        $scope.login = function(username, password) {
            UserSrv.login(username, password)
                .then(function(response) {
                    // inform application control about login event
                    $scope.$emit('app.login', response.data);
                })
                .catch(function(err) {
                    console.error(err);

                    // TODO: notify user about error in login process
                });
        };

        // focus username field
        FocusSrv('username');
    });