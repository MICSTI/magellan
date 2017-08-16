'use strict';

angular
    .module('magellan')
    .controller('OAuthCtrl', function($scope, $state, $stateParams, UserSrv, AuthTokenSrv) {
        var token = $stateParams.token;

        if (token) {
            // save token locally
            AuthTokenSrv.setToken(token);

            UserSrv.getUser()
                .then(function(response) {
                    // inform application control about login event
                    $scope.$emit('app.login', response.data);
                })
                .catch(function(err) {
                    console.error(err);
                });
        } else {
            $state.go('error');
        }
    });