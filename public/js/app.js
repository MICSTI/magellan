var magellan = angular.module("magellan", [
    'ui.router'
], function config($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

// define application constants
magellan.constant("AppConfig", {
    "log.info": true,
    "log.error": true,

    "quiz.questions.number": 5
});

magellan.controller("AppCtrl", function($scope, $state, UserSrv, CountrySrv, QuizSrv) {
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

                    // set countries in quiz service
                    QuizSrv.setCountries(countries);
                });
        })
        .catch(function(err) {
            // the only error that can occur is that there is no token in storage, we do not need to react to that
        });

    // ----------- Event handling ------------
    $scope.$on('app.login', function(event, data) {
        // store user object in scope
        $scope.user = data;

        // init country service
        CountrySrv.init()
            .then(function(countries) {
                $scope.$broadcast('countries.loaded', countries);

                // set countries in quiz service
                QuizSrv.setCountries(countries);
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