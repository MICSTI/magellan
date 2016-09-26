'use strict';

angular
    .module('magellan')
    .controller('RegisterCtrl', function($scope, LogSrv, FocusSrv, UserSrv, $state, $window) {
        // new user object
        $scope.newUser = {};

        // message object
        $scope.message = null;

        var register = function (isValid) {
            if (!isValid) {
                return false;
            }

            if (validateBeforeSubmit()) {
                // perform api call
                UserSrv.register($scope.newUser)
                    .then(function(response) {
                        if (response.status === 200) {
                            // inform app controller about login
                            $scope.$emit('app.login', response.data);

                            // redirect to home page
                            $state.go('home', {
                                action: 'register.successful'
                            });
                        } else {
                            $scope.message = {
                                type: 'error',
                                text: 'Bei der Anmeldung scheint etwas schief gegangen zu sein'
                            }
                        }
                    })
                    .catch(function(err) {
                        LogSrv.error(err);

                        var messageText;

                        switch (err.message) {
                            case 'Username already exists':
                                messageText = 'Der Benutzername existiert bereits';
                                break;

                            default:
                                messageText = 'Bei der Anmeldung scheint etwas schief gegangen zu sein';
                        }

                        if (!$scope.$$phase) {
                            $scope.$apply(function() {
                                $scope.message = {
                                    type: 'error',
                                    text: messageText
                                };
                            });
                        } else {
                            $scope.message = {
                                type: 'error',
                                text: messageText
                            };
                        }
                    });
            }
        };

        var validateBeforeSubmit = function() {
            $scope.message = null;

            // check if the two passwords match
            var password = $scope.newUser.password;
            var password2 = $scope.newUser.password2;

            if (!$scope.newUser.username || !$scope.newUser.email || !password || !password2) {
                $scope.message = {
                    type: 'error',
                    text: 'Alle Felder müssen ausgefüllt sein'
                };
            } else if (password === "" || password2 === "") {
                $scope.message = {
                    type: 'error',
                    text: 'Die Passwörter können nicht leer sein'
                };
            } else if (password !== password2) {
                $scope.message = {
                    type: 'error',
                    text: 'Die Passwörter stimmen nicht überein'
                };
            }

            return !$scope.message ? true : false;
        };

        var delegateSubmit = function() {
            register(true);
        };

        $scope.delegateSubmit = delegateSubmit;

        $scope.register = register;

        // focus user name field
        FocusSrv('#username');
    });