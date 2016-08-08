var magellan = angular.module("magellan", [
    'ui.router'
]);

magellan.controller("AppCtrl", function($scope, $state) {
    // app config
    $scope.app = {
        config: {
            title: "Magellan",
            subtitle: "Test your knowledge about the countries of our world",
            author: "Michael Stifter"
        }
    };

    // ----------- Event handling ------------
    $scope.$on('app.login', function(event, data) {
        $scope.user = data;

        // go to quiz page
        $state.go('quiz');
    });
});