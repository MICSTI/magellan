'use strict';

angular
    .module('magellan')
    .directive('quiz', function() {
        return {
            templateUrl: 'dist/views/templates/quiz-directive.template.html',
            scope: true,
            controller: 'QuizDirectiveController',
            restrict: 'E',
            link: function link(scope, element, attrs) {

            }
        }
    });