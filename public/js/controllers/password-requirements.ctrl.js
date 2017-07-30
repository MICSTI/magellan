'use strict';

angular
    .module('magellan')
    .controller('PasswordRequirementsCtrl', function($scope) {
        var reqs = [
            { key: 'minLength', description: 'Das Passwort muss zumindest 8 Zeichen lang sein' },
            { key: 'lowercaseChars', description: 'Das Passwort muss zumindest einen Kleinbuchstaben enthalten' },
            { key: 'uppercaseChars', description: 'Das Passwort muss zumindest einen Großbuchstaben enthalten' },
            { key: 'numericChars', description: 'Das Passwort muss zumindest eine Zahl enthalten' },
            { key: 'specialChars', description: 'Das Passwort muss zumindest ein Sonderzeichen enthalten' }
        ];

        var validator = new PasswordRequirementsValidator();

        $scope.$watch('passwordInput', function(newValue, oldValue, scope) {
            updateRequirements(newValue);
        });

        var setScopeProperty = function(prop, value) {
            $scope[prop] = value;
        };

        var updateRequirements = function(password) {
            var result = validator.check(password);

            setScopeProperty('requirements', reqs.map(function(requirement) {
                return {
                    description: requirement.description,
                    fulfilled: result.failedChecks.indexOf(requirement.key) < 0
                };
            }));
        };
    });