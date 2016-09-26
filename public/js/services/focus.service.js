'use strict';

angular
    .module('magellan')
    .factory('FocusSrv', function($timeout, $window) {
        return function(selector) {
            // timeout makes sure that is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function() {
                var element = $window.document.querySelector(selector);

                if (element) {
                    element.focus();
                }
            });
        };
    });