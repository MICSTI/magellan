'use strict';

angular
    .module('magellan')
    .directive('sortableList', function() {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/sortable-list.template.html',
            controller: 'SortableListCtrl',
            scope: {

            }
        }
    });