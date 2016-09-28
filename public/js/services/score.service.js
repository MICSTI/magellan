'use strict';

angular
    .module('magellan')
    .factory('ScoreSrv', function($http) {
        /**
         * Fetches the entire highscore list in an array from the API.
         * Returns a promise.
         */
        var getHighscoreList = function() {
            return new Promise(function(resolve, reject) {
                $http.get('/api/scores/all')
                    .success(function(list) {
                        resolve(list);
                    })
                    .error(function(err) {
                        reject(err);
                    });
            });
        };

        /**
         * Fetches the highscore object for the logged in user.
         * If the user has no result yet, an empty object is returned.
         * Returns a promise.
         */
        var getUserHighscore = function() {
            return new Promise(function(resolve, reject) {
                $http.get('/api/scores/user')
                    .success(function(score) {
                        resolve(score);
                    })
                    .error(function(err) {
                        reject(err);
                    });
            });
        };

        /**
         * Fetches the highscore object for the overall highscore.
         * If there is currently no result yet, an empty object is returned.
         * Returns a promise.
         */
        var getOverallHighscore = function() {
            return new Promise(function(resolve, reject) {
                $http.get('/api/scores/high')
                    .success(function(score) {
                        resolve(score);
                    })
                    .error(function(err) {
                        reject(err);
                    });
            });
        };

        /**
         * Puts a highscore result for the logged in user.
         * @param score     Number with the achieved score.
         * @returns {Promise}
         */
        var putHighscore = function(score) {
            return new Promise(function(resolve, reject) {
                $http.put('/api/scores', { score: score })
                    .success(function(data) {
                        resolve(data);
                    })
                    .error(function(err) {
                        reject(err);
                    });
            });
        };

        return {
            getHighscoreList: getHighscoreList,
            getUserHighscore: getUserHighscore,
            getOverallHighscore: getOverallHighscore,
            putHighscore: putHighscore
        };
    });