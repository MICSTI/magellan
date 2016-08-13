var magellan = angular.module("magellan", [
    'ui.router'
], function config($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

magellan.controller("AppCtrl", function($scope, $state, UserSrv) {
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
        })
        .catch(function(err) {
            console.error(err);
        });

    // ----------- Event handling ------------
    $scope.$on('app.login', function(event, data) {
        // store user object in scope
        $scope.user = data;

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