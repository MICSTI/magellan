'use strict';

angular
    .module('magellan')
    .filter('renderHtml', function($sce) {
        return $sce.trustAsHtml;
    });