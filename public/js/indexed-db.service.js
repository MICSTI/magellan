'use strict';

angular
    .module('magellan')
    .factory('IndexedDBSrv', function($window) {
        var keyPath = 'name';

        var indexedDB = $window.indexedDB || $window.webkitIndexedDB || $window.msIndexedDB;
        var IDBKeyRange = $window.IDBKeyRange || $window.webkitIDBKeyRange;

        var IDBTransaction = $window.IDBTransaction || $window.webkitIDBTransaction;

        if (IDBTransaction) {
            IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
            IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
        }

        var indexedDBAvailable = function() {
            return indexedDB ? true : false;
        };

        var createDatabase = function(dbName, storeName) {
            return new Promise(function(resolve, reject) {
                var request = indexedDB.open(dbName);

                request.onupgradeneeded = function(e) {
                    // e is an instance of IDBVersionChangeEvent
                    var idb = e.target.result;

                    var store = idb.createObjectStore(storeName, { keyPath: keyPath });
                };

                request.onsuccess = function(e) {
                    // add, update, delete
                    resolve(e);
                };

                request.onerror = function(e) {
                    // handle error
                    reject(e);
                };
            });
        };

        var dropDatabase = function(dbName) {
            return new Promise(function(resolve, reject) {
                var request = indexedDB.deleteDatabase(dbName);

                request.onsuccess = function(e) {
                    // drop successful
                    resolve(e);
                };

                request.onerror = function(e) {
                    // drop failed
                    reject(e);
                };
            });
        };

        var addItem = function(dbName, storeName, item) {
            return new Promise(function(resolve, reject) {
                var request = indexedDB.open(dbName);

                request.onsuccess = function(e) {
                    var idb = e.target.result;
                    var transaction = idb.transaction(storeName, IDBTransaction.READ_WRITE);
                    var store = transaction.objectStore(storeName);

                    // add
                    var requestAdd = store.add(item);

                    requestAdd.onsuccess = function(e) {
                        resolve(e);
                    };

                    requestAdd.onerror = function(e) {
                        reject(e);
                    };
                };
            });
        };

        var retrieveItem = function(dbName, storeName, itemName) {
            return new Promise(function(resolve, reject) {
                var item = null;

                var request = indexedDB.open(dbName);

                request.onsuccess = function(e) {
                    var idb = e.target.result;
                    var transaction = idb.transaction(storeName, IDBTransaction.READ_ONLY);
                    var store = transaction.objectStore(storeName);

                    var range = IDBKeyRange.only(itemName);

                    store.openCursor(range).onsuccess = function(e) {
                        var cursor = e.target.result;

                        if (cursor) {
                            item = cursor.value;

                            cursor.continue();
                        } else {
                            resolve(item);
                        }
                    }
                };

                request.onerror = function(e) {
                    reject(e);
                };
            });
        };

        var retrieveItems = function(dbName, storeName) {
            return new Promise(function(resolve, reject) {
                var items = [];

                var request = indexedDB.open(dbName);

                request.onsuccess = function(e) {
                    var idb = e.target.result;
                    var transaction = idb.transaction(storeName, IDBTransaction.READ_ONLY);
                    var store = transaction.objectStore(storeName);

                    store.openCursor().onsuccess = function(e) {
                        var cursor = e.target.result;

                        if (cursor) {
                            items.push(cursor.value);

                            cursor.continue();
                        } else {
                            resolve(items);
                        }
                    }
                };

                request.onerror = function(e) {
                    reject(e);
                };
            });
        };

        return {
            createDatabase: createDatabase,
            dropDatabase: dropDatabase,
            addItem: addItem,
            retrieveItem: retrieveItem,
            retrieveItems: retrieveItems,
            indexedDBAvailable: indexedDBAvailable
        };
    });