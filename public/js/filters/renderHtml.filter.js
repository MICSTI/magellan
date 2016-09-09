'use strict';

angular
    .module('magellan')
    .filter('renderHtml', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    });