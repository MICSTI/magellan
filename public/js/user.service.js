'use strict';

angular
    .module('magellan')
    .factory('UserSrv', function($http) {
        var self = this;

        var getUser = function() {
            return $http.get('/api/user', {
                headers: { 'X-Auth': self.token }
            });
        };

        var login = function(username, password) {
            return $http.post('/api/session', {
                username: username,
                password: password
            }).then(function(response) {
                self.token = response.data;

                return getUser();
            });
        };

        return {
            getUser: getUser,
            login: login
        }
    });