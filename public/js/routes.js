angular.module('magellan')
    .config(function($locationProvider, $stateProvider, $urlRouterProvider) {
        // enable HTML5 pushstate
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/build/views/partials/home.partial.html',
                params: {
                    action: null
                }
            })
            .state('quiz', {
                url: '/quiz',
                templateUrl: '/build/views/partials/quiz.partial.html'
            })
            .state('countries', {
                url: '/countries',
                templateUrl: '/build/views/partials/countries.partial.html'
            })
            .state('countries.detail', {
                url: '/:alpha3Code',
                templateUrl: '/build/views/partials/countries-detail.partial.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/build/views/partials/login.partial.html'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: '/build/views/partials/register.partial.html'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '/build/views/partials/settings.partial.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: '/build/views/partials/about.partial.html'
            })
            .state('highscore', {
                url: '/highscore',
                templateUrl: '/build/views/partials/highscore.partial.html'
            })
            .state('countries-difficulty', {
                url: '/countries-difficulty',
                templateUrl: '/build/views/partials/country-difficulty.partial.html'
            })
    });