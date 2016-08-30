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

        return {
            getUser: getUser,
            getUserFromStorage: getUserFromStorage,
            login: login,
            logout: logout
        }
    });