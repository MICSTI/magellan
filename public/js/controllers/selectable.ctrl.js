'use strict';

angular
    .module('magellan')
    .controller('SelectableCtrl', function($scope) {
        // state of the selectable component
        var selected = false;

        var toggleState = function() {
            selected = !selected;
        };

        var isSelected = function() {
            return selected;
        };

        $scope.toggleState = toggleState;
        $scope.isSelected = isSelected;
    });