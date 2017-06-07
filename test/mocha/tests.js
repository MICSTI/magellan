var chai = require("chai");
var chaiHttp = require("chai-http");
var fs = require('fs');
var path = require('path');

var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

// countries asset file
var countries = require('../../build/assets/countries.json');

// model file
var models = require('../../public/js/models');
var Question = models.Question;
var Quiz = models.Quiz;

// check countries file
describe('Countries file', function() {
    it('should have more than 180 countries', function(done) {
        expect(countries).to.have.length.above(180);

        done();
    });

    it('each country should have all properties', function(done) {
        countries.forEach(function(country) {
            country.should.have.property('name');
            country.should.have.property('capital');
            country.should.have.property('region');
            country.should.have.property('subregion');
            country.should.have.property('population');
            country.should.have.property('area');
            country.should.have.property('borders');
            country.should.have.property('alpha2Code');
            country.should.have.property('alpha3Code');
        });

        done();
    });
});

// check CSS flags
describe('Flags', function() {
    it('each country should have a flag file', function() {
        countries.forEach(function(country) {
            fs.statSync(path.resolve(__dirname, '../../lib/flags/flags/4x3/' + country.alpha2Code.toLowerCase() + '.svg'));
        });
    });
});

// check general question model
describe('Question model (general)', function () {
    beforeEach(function(done) {
        fullPoints = 100;
        zeroPoints = 0;

        question = new Question({
            text: "Hauptstadt von Österreich?",
            info: {
                type: "text"
            },
            answer: {
                correct: "Wien",
                altSpellings: ["Wein"]
            },
            checkAnswer: function(answer, submittedAnswer, hintsUsed, hintCost, info) {
                var allowedSpellings;

                if (answer.altSpellings && answer.altSpellings.length > 0) {
                    allowedSpellings = answer.altSpellings.map(function(spelling) {
                        return spelling.toLocaleLowerCase();
                    });
                } else {
                    allowedSpellings = [];
                }

                var points = 0;

                switch (info.type) {
                    case "text":
                        var correct = submittedAnswer.toLocaleLowerCase() === answer.correct.toLocaleLowerCase() || (allowedSpellings && allowedSpellings.indexOf(submittedAnswer.toLocaleLowerCase()) >= 0);
                        points = correct ? fullPoints : zeroPoints;

                        // if hints are allowed and have been used, subtract the points
                        if (hintsUsed > 0) {
                            points -= (hintsUsed * hintCost);
                        }

                        break;
                }

                return points;
            }
        });

        done();
    });

    it('configures the object correctly', function () {
        expect(question.question()).to.equal('Hauptstadt von Österreich?');
        expect(question.getInfo()).to.be.an('object');
        expect(question.info('type')).to.not.be.null;
        expect(question.info('type')).to.equal('text');
        expect(question.answered()).to.be.false;
    });

    it('does not return the correct answer before the question has been answered', function() {
        expect(question.solution()).to.be.null;

        question.answer("Wien");

        expect(question.solution()).to.not.be.null;
    });

    it('returns a number with the achieved points after answering a question', function() {
        expect(question.answer("Wien")).to.be.a('number');
        expect(question.points()).to.be.a('number');
    });

    it('correctly returns its answered status', function() {
        expect(question.answered()).to.be.false;

        question.answer('Wien');

        expect(question.answered()).to.be.true;
    });

    it('does not give a hint if no hints are allowed', function() {
        expect(question.hint()).to.be.null;
    });

    it('awards full points for submitting the correct answer', function() {
        expect(question.answer("Wien")).to.equal(fullPoints);
    });

    it('awards full points for a correct answer in different casing', function() {
        expect(question.answer("wien")).to.equal(fullPoints);
    });

    it('awards full points for a correct alternate-spelled answer in different casing', function() {
        expect(question.answer("wein")).to.equal(fullPoints);
    });

    it('awards no points for submitting an incorrect answer', function() {
        expect(question.answer("Wie")).to.equal(zeroPoints);
    });

    it('accepts an alternate spelling of the solution as a correct answer', function() {
        question.answer("Wein");

        expect(question.points()).to.equal(fullPoints);
    });
});

// check hint logc of question model
describe('Question model (hints)', function() {
    beforeEach(function() {
        fullPoints = 100;
        zeroPoints = 0;
        hintsPossible = 3;
        hintCost = 25;

        question = new Question({
            text: "Hauptstadt von Österreich?",
            info: {
                type: "text"
            },
            answer: {
                correct: "Wien",
                altSpellings: ["Wein"]
            },
            hints: {
                allowed: true,
                maximum: hintsPossible,
                cost: hintCost,
                give: function(hintsUsed, answer) {
                    return answer.correct.substr(0, hintsUsed);
                }
            },
            checkAnswer: function(answer, submittedAnswer, hintsUsed, hintCost, info) {
                var allowedSpellings;

                if (answer.altSpellings && answer.altSpellings.length > 0) {
                    allowedSpellings = answer.altSpellings.map(function(spelling) {
                        return spelling.toLocaleLowerCase();
                    });
                } else {
                    allowedSpellings = [];
                }

                var points = 0;

                switch (info.type) {
                    case "text":
                        var correct = submittedAnswer.toLocaleLowerCase() === answer.correct.toLocaleLowerCase() || (allowedSpellings && allowedSpellings.indexOf(submittedAnswer.toLocaleLowerCase()) >= 0);
                        points = correct ? fullPoints : zeroPoints;

                        // if hints are allowed and have been used, subtract the points
                        if (hintsUsed > 0) {
                            points -= (hintsUsed * hintCost);
                        }

                        break;
                }

                return points;
            }
        });
    });

    it('gives hints as long as it is allowed', function() {
        expect(question.hint()).to.equal('W');
        expect(question.hint()).to.equal('Wi');
        expect(question.hint()).to.equal('Wie');

        // subsequent calls just return the last result
        expect(question.hint()).to.equal('Wie');
        expect(question.hint()).to.equal('Wie');
    });

    it('correctly tells us if hints are allowed', function() {
        expect(question.hintsAllowed()).to.be.true;

        var otherQuestion = new Question({
            text: 'A'
        });
        expect(otherQuestion.hintsAllowed()).to.be.false;
    });

    it('correctly tells us the number of remaining hints', function() {
        expect(question.hintsRemaining()).to.equal(hintsPossible);

        question.hint();
        expect(question.hintsRemaining()).to.equal(hintsPossible - 1);

        question.hint();
        question.hint();
        question.hint();

        expect(question.hintsRemaining()).to.equal(0);
    });

    it('subtracts the correct number of points when hints are taken', function() {
        question.hint();
        question.hint();

        expect(question.answer('Wien')).to.equal(fullPoints - (2 * hintCost));
    });

    it('throws an error if hints are allowed but no giveHint method was set', function() {
        var questionWithoutGiveHint = new Question({
            hints: {
                allowed: true,
                maximum: hintsPossible,
                cost: hintCost
            }
        });

        expect(questionWithoutGiveHint.hint).to.throw(Error);
    });
});

// test quiz model
describe('Quiz model', function() {
    beforeEach(function() {
        quiz = new Quiz();
    });

    it('is an object', function() {
        expect(quiz).to.be.an('object');
    });

    it('is not possible to start a quiz without questions', function() {
        expect(quiz.start).to.throw(Error);
    });

    it('returns a correct active status', function() {
        expect(quiz.isActive()).to.be.false;

        quiz.addQuestion(new Question());

        quiz.start();

        expect(quiz.isActive()).to.be.true;
    });

    it('is possible to add valid question objects', function()  {
        expect(quiz.addQuestion.bind(quiz, new Question({}))).to.not.throw(Error);
    });

    it('is not possible to add an invalid question object', function() {
        // an error must be thrown when no question object was passed
        expect(quiz.addQuestion.bind(quiz)).to.throw(Error);

        // an error must be thrown when an invalid object was passed
        expect(quiz.addQuestion.bind(quiz, {})).to.throw(Error);
    });

    it('returns the correct number of questions', function() {
        expect(quiz.getNumberOfQuestions()).to.equal(0);

        quiz.addQuestion(new Question());

        expect(quiz.getNumberOfQuestions()).to.equal(1);
    });

    it('returns the first question when the quiz is started', function() {
        quiz.addQuestion(new Question());

        expect(quiz.start()).to.be.an('object');
    });

    it('returns the number of total points achieved in the quiz if the quiz has been started', function() {
        expect(quiz.getTotalPoints()).to.be.null;

        quiz.addQuestion(new Question());
        quiz.start();

        expect(quiz.getTotalPoints()).to.be.a('number');
    });

    it('follows the quiz process correctly', function() {
        var fullPoints = 100;
        var zeroPoints = 0;
        var hintsPossible = 3;
        var hintCost = 25;

        expect(quiz.hasStarted()).to.be.false;

        // first question
        quiz.addQuestion(new Question({
            text: "Hauptstadt von Österreich?",
            info: {
                type: "text"
            },
            answer: {
                correct: "Wien"
            },
            hints: {
                allowed: true,
                maximum: hintsPossible,
                cost: hintCost,
                give: function(hintsUsed, answer) {
                    return answer.correct.substr(0, hintsUsed);
                }
            },
            checkAnswer: function(answer, submittedAnswer, hintsUsed, hintCost, info) {
                var allowedSpellings;

                if (answer.altSpellings && answer.altSpellings.length > 0) {
                    allowedSpellings = answer.altSpellings.map(function(spelling) {
                        return spelling.toLocaleLowerCase();
                    });
                } else {
                    allowedSpellings = [];
                }

                var points = 0;

                switch (info.type) {
                    case "text":
                        var correct = submittedAnswer.toLocaleLowerCase() === answer.correct.toLocaleLowerCase() || (allowedSpellings && allowedSpellings.indexOf(submittedAnswer.toLocaleLowerCase()) >= 0);
                        points = correct ? fullPoints : zeroPoints;

                        // if hints are allowed and have been used, subtract the points
                        if (hintsUsed > 0) {
                            points -= (hintsUsed * hintCost);
                        }

                        break;
                }

                return points;
            }
        }));

        // second question
        quiz.addQuestion(new Question({
            text: "Hauptstadt von Italien?",
            info: {
                type: "text"
            },
            answer: {
                correct: "Rom"
            },
            checkAnswer: function(answer, submittedAnswer, hintsUsed, hintCost, info) {
                var allowedSpellings;

                if (answer.altSpellings && answer.altSpellings.length > 0) {
                    allowedSpellings = answer.altSpellings.map(function(spelling) {
                        return spelling.toLocaleLowerCase();
                    });
                } else {
                    allowedSpellings = [];
                }

                var points = 0;

                switch (info.type) {
                    case "text":
                        var correct = submittedAnswer.toLocaleLowerCase() === answer.correct.toLocaleLowerCase() || (allowedSpellings && allowedSpellings.indexOf(submittedAnswer.toLocaleLowerCase()) >= 0);
                        points = correct ? fullPoints : zeroPoints;

                        // if hints are allowed and have been used, subtract the points
                        if (hintsUsed > 0) {
                            points -= (hintsUsed * hintCost);
                        }

                        break;
                }

                return points;
            }
        }));

        var firstQuestion = quiz.start();

        expect(quiz.hasStarted()).to.be.true;

        // we take two hints for the first question (so we should get 50 points for this answer)
        firstQuestion.hint();
        firstQuestion.hint();
        firstQuestion.answer("wien");

        expect(firstQuestion.points()).to.equal(fullPoints - (2 * hintCost));

        expect(quiz.hasEnded()).to.be.false;

        var secondQuestion = quiz.nextQuestion();

        secondQuestion.answer("Rom");

        expect(quiz.nextQuestion()).to.be.false;
        expect(quiz.hasEnded()).to.be.true;

        expect(quiz.getTotalPoints()).to.equal(2 * fullPoints - (2 * hintCost));
    });
});