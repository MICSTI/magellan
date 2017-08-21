'use strict';

angular
    .module('magellan')
    .controller('SettingsCtrl', function($scope, AppConfig, FocusSrv, LogSrv, UserSrv) {
        var init = function() {
            $scope.message = null;

            // user colours
            var colors = AppConfig['settings.user.colors'];

            // user object
            $scope.userObj = {
                username: $scope.user.username,
                email: $scope.user.email,
                color: $scope.user.color,
                emailUpdates: $scope.user.emailUpdates
            };

            $scope.userColors = colors;

            var setColor = function(newColor) {
                $scope.userObj.color = newColor;
            };

            var updateUser = function() {
                UserSrv.updateBasic($scope.userObj).then(function(data) {
                    // update user object
                    $scope.user.username = $scope.userObj.username;
                    $scope.user.email = $scope.userObj.email;
                    $scope.user.color = $scope.userObj.color;
                    $scope.user.emailUpdates = $scope.userObj.emailUpdates;

                    $scope.$apply(function() {
                        $scope.message = {
                            type: 'success',
                            text: 'Einstellungen wurden erfolgreich gespeichert'
                        };
                    });
                }).catch(function(err) {
                    LogSrv.error('Update user', err);

                    var messageText;

                    switch (err.message) {
                        case 'Username already exists':
                            messageText = 'Der Benutzername ist bereits vergeben';
                            break;

                        case 'Email address already exists':
                            messageText = 'Die E-Mail-Adresse ist bereits vergeben';
                            break;

                        default:
                            messageText = 'Die Einstellungen konnten nicht gespeichert werden';
                            break;
                    }

                    $scope.$apply(function() {
                        $scope.message = {
                            type: 'error',
                            text: messageText
                        };
                    });
                });
            };

            var delegateSubmit = function() {
                updateUser(true);
            };

            $scope.setColor = setColor;
            $scope.updateUser = updateUser;
            $scope.delegateSubmit = delegateSubmit;

            // focus username field
            FocusSrv('#username');
        };

        if ($scope.user) {
            init();
        }

        // otherwise, wait for user.loaded event
        $scope.$on('user.loaded', function(event, data) {
            init();
        });
    });