'use strict';

angular
    .module('magellan')
    .factory('CountrySrv', function($http, IndexedDBSrv) {
        // IndexedDB
        var database = 'magellan';
        var store = 'countryStore';
        var keyCountries = 'countries';
        var keyVersion = 'version';

        var indexedDBAvailable = IndexedDBSrv.indexedDBAvailable();

        var loadCountries = function() {
            // check if indexedDB is available
            if (indexedDBAvailable) {
                return new Promise(function(resolve, reject) {
                    // make sure database exists
                    IndexedDBSrv.createDatabase(database, store)
                        .then(getEmptyObject)
                        .then(getInternalVersion)
                        .then(getExternalVersion)
                        .then(function(obj) {
                            console.log("OBJ", obj);
                        })
                        .catch(function(err) {
                            console.error(err);
                        });
                });
            } else {
                // if not, we always try to download it from the country API endpoint
                return getCountriesFromAPI();
            }
        };

        var getEmptyObject = function() {
            return new Promise(function(resolve, reject) {
                resolve({});
            });
        };

        var getInternalVersion = function(obj) {
            return new Promise(function(resolve, reject) {
                IndexedDBSrv.retrieveItem(database, store, keyVersion)
                    .then(function(item) {
                        obj["internalVersion"] = item;

                        resolve(obj);
                    })
                    .catch(function(err) {
                        resolve(null);
                    });
            });
        };

        var getExternalVersion = function(obj) {
            return getVersionFromAPI()
                .then(function(version) {
                    obj["externalVersion"] = version;

                    return obj;
                });
        };

        var getCountriesFromAPI = function() {
            return new Promise(function(resolve, reject) {
                $http.get('/api/countries')
                    .then(function(response) {
                        resolve(response.data);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            });
        };

        var getVersionFromAPI = function() {
            return new Promise(function(resolve, reject) {
                $http.get('/api/countries/version')
                    .then(function(response) {
                        resolve(response.data.version || 0);
                    })
                    .catch(function(err) {
                        resolve(0);
                    });
            });
        };

        return {
            loadCountries: loadCountries
        };
    });