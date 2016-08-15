var magellan = angular.module("magellan", [
    'ui.router'
], function config($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

magellan.controller("AppCtrl", function($scope, $state, UserSrv, CountrySrv) {
    // ----------- App config ------------
    $scope.app = {
        config: {
            title: "Magellan",
            subtitle: "Test your knowledge about the countries of our world",
            author: "Michael Stifter"
        }
    };

    // ----------- App initialization ------------
    UserSrv.getUserFromStorage()
        .then(function(user) {
            // store user object in scope
            $scope.user = user;

            // init country service
            CountrySrv.init()
                .then(function(countries) {
                    $scope.$broadcast('countries.loaded', countries);
                });
        })
        .catch(function(err) {
            // the only error that can occur is that there is no token in storage, we do not need to react to that
        });

    /*IndexedDBSrv.createDatabase(database)
        .then(function(e) {
            console.log("INDEXEDDB created SUCCESS", e);

            IndexedDBSrv.addItem(database, store, {
                name: keyCountries,
                value: [{name: 'Austria'}, {name: 'England'}]
            }).then(function(e) {
                console.log("ADD ITEM SUCCESS", e);
            }).catch(function(e) {
                console.error("ADD ITEM ERROR", e);
            })
        })
        .catch(function(e) {
            console.error("INDEXEDDB created ERROR", e);
        });*/

    /*IndexedDBSrv.addItem(database, store, {
        name: keyVersion,
        value: 1
    }).then(function(e) {
        console.log("ADD ITEM SUCCESS", e);
    }).catch(function(e) {
        console.error("ADD ITEM ERROR", e);
    })*/

    /*IndexedDBSrv.retrieveItem(database, store, keyVersion)
        .then(function(e) {
            console.log("RETRIEVE SUCCESS", e);
        })
        .catch(function(e) {
            console.error("RETRIEVE ERROR", e);
        });*/

    // ----------- Event handling ------------
    $scope.$on('app.login', function(event, data) {
        // store user object in scope
        $scope.user = data;

        // init country service
        CountrySrv.init()
            .then(function(countries) {
                $scope.$broadcast('countries.loaded', countries);
            });

        // go to quiz page
        $state.go('quiz');
    });

    $scope.$on('app.logout', function(event, data) {
        // remove user object from scope
        $scope.user = null;

        // go to home page
        $state.go('home');
    });
});