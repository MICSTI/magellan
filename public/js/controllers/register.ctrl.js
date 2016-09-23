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
                                message: 'Bei der Anmeldung scheint etwas schief gegangen zu sein'
                            }
                        }
                    })
                    .catch(function(err) {
                        LogSrv.error('REGISTER', err);
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
                    text: 'All fields must be filled in'
                };
            } else if (password === "" || password2 === "") {
                $scope.message = {
                    type: 'error',
                    text: 'Passwords cannot be empty'
                };
            } else if (password !== password2) {
                $scope.message = {
                    type: 'error',
                    text: 'Passwords do not match'
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
        FocusSrv('username');
    });