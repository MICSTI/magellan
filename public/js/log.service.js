'use strict';

angular
    .module('magellan')
    .factory('LogSrv', function(AppConfig) {
        var logInfo = function() {
            if (AppConfig["log.info"]) {
                console.log.apply(console, arguments);
            }
        };

        var logError = function() {
            if (AppConfig["log.error"]) {
                console.error.apply(console, arguments);
            }
        };

        return {
            logInfo: logInfo,
            logError: logError
        };
    });