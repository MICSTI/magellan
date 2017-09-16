'use strict';

angular
    .module('magellan')
    .factory('ToastSrv', function(AppConfig, $timeout) {
        // toasts array
        var toasts = [];

        var get = function(id) {
            var toast = null;

            toasts.forEach(function(item) {
                if (item.id === id) {
                    toast = item;
                }
            });

            return toast;
        };

        var add = function(type, message, timeout) {
            if (typeof timeout === 'undefined') {
                timeout = AppConfig['toast.default'];
            }

            var toast = new Toast(type, message, timeout);

            toasts.push(toast);

            $timeout(function() {
                toast.visible = true;

                $timeout(function() {
                    toast.visible = false;

                    $timeout(function() {
                        // we finally have to delete the toast from the array
                        remove(toast.id);
                    }, 300);
                }, 50 + 350 + toast.timeout);
            }, 50);
        };

        var short = function(type, message) {
            add(type, message, AppConfig['toast.short']);
        };

        var long = function(type, message) {
            add(type, message, AppConfig['toast.long']);
        };

        var custom = function(type, message, timeout) {
            add(type, message, timeout);
        };

        var remove = function(id) {
            // if 'id' is undefined, remove all toasts
            if (id === undefined) {
                toasts = [];
            } else {
                removeToast(id);
            }
        };

        var removeToast = function(id) {
            var toastIdx = null;

            toasts.forEach(function(toast, idx) {
                if (toast.id === id) {
                    toastIdx = idx;
                }
            });

            if (toastIdx !== null) {
                toasts.splice(toastIdx, 1);
            }
        };

        var getToasts = function() {
            return toasts;
        };

        var getToastsLength = function() {
            return toasts.length;
        };

        return {
            custom: custom,
            long: long,
            short: short,
            remove: remove,
            getToasts: getToasts,
            getToastsLength: getToastsLength
        };
    });