'use strict';

angular
    .module('magellan')
    .factory('EventSrv', function($http, LogSrv) {
        var add = function(name) {
            $http.post('/api/event/add', {
                name: name
            }).success(function(data) {
                // no need to react to success case
            }).catch(function(err) {
                LogSrv.error('failed to add event', err);
            });
        };

        return {
            add: add
        };
    });