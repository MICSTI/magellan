angular.module('magellan')
    .config(function($locationProvider, $stateProvider, $urlRouterProvider) {
        // enable HTML5 pushstate
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/build/views/home.partial.html'
            })
            .state('quiz', {
                url: '/quiz',
                templateUrl: '/build/views/quiz.partial.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/build/views/login.partial.html'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: '/build/views/register.partial.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: '/build/views/about.partial.html'
            });
    });