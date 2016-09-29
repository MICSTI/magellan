'use strict';

angular
    .module('magellan')
    .filter('textOrNumber', function($filter) {
        return function(input, fractionSize) {
            fractionSize = fractionSize !== undefined ? 0 : fractionSize;

            if (isNaN(input)) {
                return input;
            } else {
                return $filter('number')(input, fractionSize)
            }
        };
    });