var magellan = angular.module("magellan", [
    'ui.router',
    'ngProgress',
    'ngAnimate'
], function config($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

// define application constants
magellan.constant("AppConfig", {
    "log.info": true,
    "log.error": true,

    "quiz.country.questions": 16,
    "quiz.country.types": {
        1: "CAPITAL_OF_COUNTRY",
        2: "COUNTRY_OF_CAPITAL",
        3: "POPULATION_OF_COUNTRY",
        4: "AREA_OF_COUNTRY",
        5: "FLAG_OF_COUNTRY"
        //6: "LOCATION_OF_COUNTRY"
    },

    "settings.user.colors": [
        'soft_red',
        'thunderbird',
        'old_brick',
        'new_york_pink',
        'snuff',
        'honey_flower',
        'san_marino',
        'shakespeare',
        'ming',
        'gossip',
        'eucalyptus',
        'mountain_meadow',
        'jade',
        'confetti',
        'california',
        'burnt_orange',
        'jaffa',
        'gallery',
        'edward',
        'lynch'
    ]
});

magellan.controller("AppCtrl", function($rootScope, $scope, $state, $window, AuthSrv, UserSrv, CountrySrv, QuizSrv) {
    // ----------- App config ------------
    $scope.app = {
        config: {
            title: "Magellan",
            subtitle: "Teste dein Wissen über die Länder unserer Erde",
            author: "Michael Stifter"
        }
    };

    // ----------- App initialization ------------
    AuthSrv.getUser()
        .then(function(user) {
            // store user object in scope
            $scope.user = user;

            $scope.$broadcast('user.loaded');

            // init country service
            CountrySrv.init()
                .then(function(countries) {
                    $scope.$broadcast('countries.loaded', countries);

                    // set countries in quiz service
                    QuizSrv.setCountries(countries);
                });
        })
        .catch(function(err) {
            $scope.user = null;
        });

    $scope.isProgressBarVisible = function() {
        return $state.is('quiz');
    };

    $scope.doFacebookLogin = function() {
        $window.location.assign('/api/auth/facebook');
    };

    $scope.doGoogleLogin = function() {
        $window.location.assign('/api/auth/google');
    };

    var goToHome = function() {
        $state.go('home');
    };

    $scope.goToHome = goToHome;

    // ----------- Event handling ------------
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        if (error === 'Not authorized') {
            // go to home page
            $state.go('home');
        }
    });

    $scope.$on('app.login', function(event, data) {
        // store user object in scope
        $scope.user = data;

        // additionally save it in auth service
        AuthSrv.setUser(data);

        // init country service
        CountrySrv.init()
            .then(function(countries) {
                $scope.$broadcast('countries.loaded', countries);

                // set countries in quiz service
                QuizSrv.setCountries(countries);
            });

        // go to quiz page
        $state.go('home');
    });

    $scope.$on('app.logout', function(event, data) {
        // remove user object from scope
        $scope.user = null;

        // additionally, remove it from auth service
        AuthSrv.clearUser();

        // go to home page
        $state.go('home');
    });
});