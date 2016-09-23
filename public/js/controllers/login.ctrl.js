'use strict';

angular
    .module('magellan')
    .controller('LoginCtrl', function($scope, UserSrv, FocusSrv) {
        $scope.message = null;

        $scope.login = function(username, password) {
            UserSrv.login(username, password)
                .then(function(response) {
                    $scope.message = null;

                    // inform application control about login event
                    $scope.$emit('app.login', response.data);
                })
                .catch(function(err) {
                    console.error(err);

                    var messageText;

                    if (err.status === 401) {
                        messageText = 'Falscher Benutzername oder Passwort';
                    } else {
                        messageText = 'Beim Einloggen scheint etwas schief gegangen zu sein';
                    }

                    $scope.message = {
                        type: 'error',
                        text: messageText
                    };
                });
        };

        // focus username field
        FocusSrv('username');
    });