var magellan = angular.module("magellan", [
    'ui.router'
]);

magellan.controller("AppCtrl", function($scope) {
    // app config
    $scope.app = {
        config: {
            title: "Magellan",
            author: "Michael Stifter"
        }
    };
});