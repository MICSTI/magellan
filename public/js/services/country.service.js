'use strict';

angular
    .module('magellan')
    .factory('CountrySrv', function($http, IndexedDBSrv, LogSrv) {
        // Countries array
        var countries = null;

        var countriesByAlpha3 = null;

        // IndexedDB
        var database = 'magellan';
        var store = 'countryStore';
        var keyCountries = 'countries';
        var keyVersion = 'version';

        var indexedDBAvailable = IndexedDBSrv.indexedDBAvailable();

        var init = function() {
            return loadCountries();
        };

        var loadCountries = function() {
            // check if indexedDB is available
            if (indexedDBAvailable) {
                return new Promise(function(resolve, reject) {
                    // make sure database exists
                    IndexedDBSrv.createDatabase(database, store)
                        .then(getEmptyObject)
                        .then(getInternalVersion)
                        .then(getExternalVersion)
                        .then(determineLoadStrategy)
                        .then(loadData)
                        .then(function(obj) {
                            countries = obj['countries'];

                            LogSrv.info("loaded countries from", obj['loadStrategy'].toUpperCase());

                            // additionally map countries by alpha3 code
                            countriesByAlpha3 = {};

                            countries.forEach(function(c) {
                                countriesByAlpha3[c['alpha3Code']] = c;
                            });

                            resolve(countries);
                        })
                        .catch(function(err) {
                            LogSrv.error("failed to load countries", err);

                            reject(err);
                        });
                });
            } else {
                // if not, we always try to download it from the country API endpoint
                return getCountriesFromAPI();
            }
        };

        var determineLoadStrategy = function(obj) {
            return new Promise(function(resolve, reject) {
                var strategy;

                var internalVersion = obj["internalVersion"];
                var externalVersion = obj["externalVersion"];

                if (internalVersion === null) {
                    strategy = 'api';
                } else if (externalVersion > internalVersion) {
                    strategy = 'api';
                } else {
                    strategy = 'db';
                }

                obj['loadStrategy'] = strategy;

                resolve(obj);
            });
        };

        var loadData = function(obj) {
            return new Promise(function(resolve, reject) {
                var strategy = obj['loadStrategy'];

                switch (strategy) {
                    case 'api':
                        getCountriesFromAPI()
                            .then(function(countries) {
                                obj["countries"] = countries;

                                // store countries and version number in database
                                IndexedDBSrv.putItem(database, store, {
                                    name: keyCountries,
                                    value:  countries
                                });

                                IndexedDBSrv.putItem(database, store, {
                                    name: keyVersion,
                                    value: obj["externalVersion"]
                                });

                                resolve(obj);
                            })
                            .catch(function(err) {
                                reject(err);
                            });

                        break;

                    case 'db':
                        getCountriesFromDB(obj)
                            .then(function(_obj) {
                                resolve(_obj);
                            })
                            .catch(function(err) {
                                reject(err);
                            });

                        break;

                    default:
                        reject('Unknown load strategy');
                }
            });
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
                        obj["internalVersion"] = item.value;

                        resolve(obj);
                    })
                    .catch(function(err) {
                        obj["internalVersion"] = null;

                        resolve(obj);
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

        var getCountriesFromDB = function(obj) {
            return new Promise(function(resolve, reject) {
                IndexedDBSrv.retrieveItem(database, store, keyCountries)
                    .then(function(item) {
                        obj["countries"] = item.value;

                        resolve(obj);
                    })
                    .catch(function(err) {
                        resolve(null);
                    })
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

        var getCountryByAlpha3 = function(alpha3) {
            if (countriesByAlpha3 === null) {
                return null;
            }

            return countriesByAlpha3[alpha3];
        }

        return {
            init: init,
            getCountryByAlpha3: getCountryByAlpha3
        };
    });