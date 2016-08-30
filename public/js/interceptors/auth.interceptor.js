'use strict';

angular
    .module('magellan')
    .factory('AuthInterceptor', function(AuthTokenSrv) {
        var addToken = function(config) {
            var token = AuthTokenSrv.getToken();

            if (token) {
                config.headers = config.headers || {};
                config.headers['X-Auth'] = token;
            }

            return config;
        };

        return {
            request: addToken
        };
    });