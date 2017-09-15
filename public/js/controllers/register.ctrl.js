'use strict';

angular
    .module('magellan')
    .controller('RegisterCtrl', function($scope, LogSrv, FocusSrv, UserSrv, $state, ToastSrv) {
        // new user object
        $scope.newUser = {
            emailUpdates: true
        };

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
                            $state.go('faq', {
                                action: 'register.successful'
                            });
                        } else {
                            ToastSrv.long('error', 'Bei der Anmeldung scheint etwas schief gegangen zu sein');
                        }
                    })
                    .catch(function(err) {
                        LogSrv.error(err);

                        var messageText;

                        switch (err.message) {
                            case 'Username already exists':
                                messageText = 'Der Benutzername ist bereits in Verwendung';
                                break;

                            case 'Email address already exists':
                                messageText = 'Die E-Mail-Adresse ist bereits in Verwendung';
                                break;

                            case 'Password does not match requirements':
                                messageText = 'Das Passwort entspricht nicht den Sicherheitsrichtlinien';
                                break;

                            default:
                                messageText = 'Bei der Anmeldung scheint etwas schief gegangen zu sein';
                        }

                        ToastSrv.long('error', messageText);
                    });
            }
        };

        var validateBeforeSubmit = function() {
            var ok = true;

            // check if the two passwords match
            var password = $scope.newUser.password;
            var password2 = $scope.newUser.password2;

            if (!$scope.newUser.username || !$scope.newUser.email || !password || !password2) {
                ok = false;
                ToastSrv.long('error', 'Alle Felder müssen ausgefüllt sein');
            } else if (password === "" || password2 === "") {
                ok = false;
                ToastSrv.long('error', 'Die Passwörter können nicht leer sein');
            } else if (password !== password2) {
                ok = false;
                ToastSrv.long('error', 'Die Passwörter stimmen nicht überein');
            }

            return ok;
        };

        var delegateSubmit = function() {
            register(true);
        };

        $scope.delegateSubmit = delegateSubmit;

        $scope.register = register;

        // focus user name field
        FocusSrv('#username');
    });