angular.module('magellan')
    .config(function($locationProvider, $stateProvider, $urlRouterProvider) {
        // enable HTML5 pushstate
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/home');

        var authorize = function(AuthSrv, LogSrv, $q) {
            return AuthSrv.getUser()
                .then(function(user) {
                    return user;
                })
                .catch(function(err) {
                    return $q.reject('Not authorized');
                });
        };

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/dist/views/partials/home.partial.html'
            })
            .state('quiz', {
                url: '/quiz',
                templateUrl: '/dist/views/partials/quiz.partial.html',
                resolve: {
                    auth: authorize
                }
            })
            .state('countries', {
                url: '/countries',
                templateUrl: '/dist/views/partials/countries.partial.html',
                resolve: {
                    auth: authorize
                }
            })
            .state('countries.detail', {
                url: '/:alpha3Code',
                templateUrl: '/dist/views/partials/countries-detail.partial.html',
                resolve: {
                    auth: authorize
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: '/dist/views/partials/login.partial.html'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: '/dist/views/partials/register.partial.html'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '/dist/views/partials/settings.partial.html',
                resolve: {
                    auth: authorize
                }
            })
            .state('password', {
                url: '/password',
                templateUrl: '/dist/views/partials/password-change.partial.html',
                resolve: {
                    auth: authorize
                }
            })
            .state('reset', {
                url: '/password/reset/:token',
                templateUrl: '/dist/views/partials/password-reset.partial.html'
            })
            .state('forgot', {
                url: '/password/forgot',
                templateUrl: '/dist/views/partials/password-forgot.partial.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: '/dist/views/partials/about.partial.html'
            })
            .state('highscore', {
                url: '/highscore',
                templateUrl: '/dist/views/partials/highscore.partial.html',
                resolve: {
                    auth: authorize
                }
            })
            .state('faq', {
                url: '/faq',
                templateUrl: '/dist/views/partials/faq.partial.html',
                params: {
                    action: null
                }
            })
            .state('countries-difficulty', {
                url: '/countries-difficulty',
                templateUrl: '/dist/views/partials/country-difficulty.partial.html',
                resolve: {
                    auth: authorize
                }
            })
    });