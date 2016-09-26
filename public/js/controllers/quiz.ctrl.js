'use strict';

angular
    .module('magellan')
    .controller('QuizCtrl', function($scope, QuizSrv, LogSrv, FocusSrv) {



        var startQuiz = function() {
            QuizSrv.init()
                .then(function() {
                    LogSrv.info("Quiz started");
                })
                .catch(function(err) {
                    LogSrv.error(err);
                });
        };

        var isQuizRunning = function() {
            return QuizSrv.isQuizRunning();
        };

        $scope.startQuiz = startQuiz;
        $scope.isQuizRunning = isQuizRunning;

        /*var updateQuestion = function() {
            question = QuizSrv.getCurrentQuestion();

            FocusSrv('answer');
        };

        var renderQuestion = function(text, className) {
            return text
                .replace("[", "<span class='" + className + "'>")
                .replace("]", "</span>");
        };

        var submitAnswer = function(submittedAnswer) {
            if (submittedAnswer) {
                console.log(question.answer(submittedAnswer));

                // set progress bar
                //$scope.progressbar.set();

                // set focus to next question button
                FocusSrv('btnNextQuestion');
            }
        };

        var handleKeyPress = function(keyEvent) {
            if (keyEvent.which == 13) {
                submitAnswer($scope.answerObj.answer);
            }
        };



        var getCurrentQuestionNumber = function() {
            return QuizSrv.getCurrentQuestionNumber();
        };

        var getNumberOfQuizQuestions = function() {
            return QuizSrv.getNumberOfQuizQuestions();
        };

        var questionAnswered = function() {
            if (!isQuizRunning() || question === null) {
                return false;
            }

            return question.answered();
        };

        var getQuestionText = function() {
            if (question === null) {
                return null;
            }

            return renderQuestion(question.question(), 'question-highlight') + "?";
        };

        var getAnswerText = function() {
            if (question === null) {
                return null;
            }

            return question.solution().correct;
        };

        var nextQuestion = function() {
            QuizSrv.nextQuestion();

            $scope.answerObj.answer = "";

            updateQuestion();
        };


        $scope.getCurrentQuestionNumber = getCurrentQuestionNumber;
        $scope.getNumberOfQuizQuestions = getNumberOfQuizQuestions;
        $scope.getQuestionText = getQuestionText;
        $scope.getAnswerText = getAnswerText;
        $scope.handleKeyPress = handleKeyPress;
        $scope.submitAnswer = submitAnswer;
        $scope.questionAnswered = questionAnswered;
        $scope.nextQuestion = nextQuestion;

        $scope.answerObj = {
            answer: ""
        };

        // initially try to update question
        updateQuestion();*/
    });