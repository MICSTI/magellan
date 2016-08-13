'use strict';

angular
    .module('magellan')
    .factory('AuthTokenSrv', function($window) {
        var store = $window.sessionStorage;
        var key = 'auth-token';

        var getToken = function() {
            return store.getItem(key);
        };

        var setToken = function(token) {
            if (token) {
                store.setItem(key, token);
            } else {
                store.removeItem(key);
            }
        };

        return {
            getToken: getToken,
            setToken: setToken
        };
    });