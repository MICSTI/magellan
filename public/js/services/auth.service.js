'use strict';

angular
    .module('magellan')
    .factory('AuthSrv', function(UserSrv) {
        var user = null;

        var getUser = function() {
            return new Promise(function(resolve, reject) {
                if (user !== null) {
                    resolve(user);
                } else {
                    UserSrv.getUserFromStorage()
                        .then(function(_user) {
                            user = _user;

                            resolve(_user);
                        })
                        .catch(function(err) {
                            reject('Not logged in');
                        });
                }
            });
        };

        var setUser = function(_user) {
            user = _user;
        };

        var clearUser = function() {
            user = null;
        };

        return {
            setUser: setUser,
            getUser: getUser,
            clearUser: clearUser
        }
    });