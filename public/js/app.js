var magellan = angular.module("magellan", [
    'ui.router'
]);

magellan.controller("AppCtrl", function($scope) {
    // app config
    $scope.app = {
        config: {
            title: "Magellan",
            subtitle: "Test your knowledge about the countries of our world",
            author: "Michael Stifter"
        }
    };
});