'use strict';

angular
    .module('magellan')
    .factory('UserSrv', function($http, AuthTokenSrv) {
        var self = this;

        var getUser = function() {
            return $http.get('/api/user');
        };

        var getUserFromStorage = function() {
            return new Promise(function(resolve, reject) {
                var token = AuthTokenSrv.getToken();

                if (token) {
                    AuthTokenSrv.setToken(token);

                    getUser()
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                } else {
                    // if there is no token, we reject the promise
                    reject("No token in storage");
                }
            });
        };

        var login = function(username, password) {
            return $http.post('/api/session', {
                username: username,
                password: password
            }).then(function(response) {
                self.token = response.data;

                // save token locally
                AuthTokenSrv.setToken(self.token);

                return getUser();
            });
        };

        var logout = function() {
            return new Promise(function(resolve, reject) {
                self.token = null;

                // remove token locally
                AuthTokenSrv.setToken();

                resolve();
            });
        };

        var register = function(newUser) {
            return new Promise(function(resolve, reject) {
                $http.post('/api/user', newUser)
                    .success(function(data) {
                        // immediately log the user in
                        login(newUser.username, newUser.password)
                            .then(function(data) {
                                resolve(data);
                            })
                            .catch(function(err) {
                                reject(err);
                            });
                    })
                    .error(function(err) {
                        reject(err);
                    });
            })  ;
        };

        return {
            getUser: getUser,
            getUserFromStorage: getUserFromStorage,
            login: login,
            logout: logout,
            register: register
        }
    });