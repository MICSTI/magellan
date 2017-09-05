'use strict';

angular
    .module('magellan')
    .factory('ToastSrv', function() {
        // toasts array
        var toasts = [];

        var add = function(type, message) {
            var toast = new Toast(type, message);

            toasts.push(toast);

            console.log('new toast with id', toast.id);
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
            add: add,
            remove: remove,
            getToasts: getToasts,
            getToastsLength: getToastsLength
        };
    });