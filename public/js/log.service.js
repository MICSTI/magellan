'use strict';

angular
    .module('magellan')
    .factory('LogSrv', function(AppConfig) {
        var logInfo = function() {
            if (AppConfig.LOG_INFO) {
                console.log.apply(console, arguments);
            }
        };

        var logError = function() {
            if (AppConfig.LOG_ERROR) {
                console.error.apply(console, arguments);
            }
        };

        return {
            logInfo: logInfo,
            logError: logError
        };
    });