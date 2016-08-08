'use strict';

angular
    .module('magellan')
    .controller('DropdownCtrl', function($scope) {
        var visible = false;

        $scope.toggleDropdown = toggleDropdown;
        $scope.showDropdown = showDropdown;
        $scope.hideDropdown = hideDropdown;
        $scope.isDropdownVisible = isDropdownVisible;

        function toggleDropdown() {
            visible = !visible;
        }

        function showDropdown() {
            visible = true;
        }

        function hideDropdown() {
            visible = false;
        }

        function isDropdownVisible() {
            return visible;
        }
    });