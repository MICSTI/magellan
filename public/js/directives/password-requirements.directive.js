'use strict';

angular
    .module('magellan')
    .directive('passwordRequirements', function() {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/password-requirements.template.html',
            controller: 'PasswordRequirementsCtrl',
            scope: {
                passwordInput: '@attributeInput'
            }
        }
    });