var magellan = angular.module("magellan", []);

magellan.controller("AppCtrl", function($scope) {
    // app config
    $scope.app = {
        config: {
            title: "Magellan",
            author: "Michael Stifter"
        }
    };
});