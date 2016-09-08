var chai = require("chai");
var chaiHttp = require("chai-http");

var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

// countries asset file
var countries = require('../../build/assets/countries.json');

// model file
var models = require('../../public/js/models');
var Question = models.Question;

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

// check question model
describe('Question model', function () {
    beforeEach(function(done) {
        question = new Question({
            text: "Hauptstadt von Österreich?",
            type: "text",
            answer: {
                correct: "Wien",
                altSpellings: ["Wein"]
            },
            checkAnswer: function(answer, submittedAnswer, type, hintsUsed) {
                var points = 0;

                switch (type) {
                    case "text":
                        var correct = submittedAnswer === answer.correct || answer.altSpellings.indexOf(submittedAnswer) >= 0;
                        points = correct ? 100 : 0;

                        // subtract used hints
                        points -= (hintsUsed * 20);

                        break;
                }

                return points;
            }
        });

        done();
    });

    it('configures the object correctly', function (done) {
        expect(question.question()).to.equal('Hauptstadt von Österreich?');
        expect(question.type()).to.equal('text');
        expect(question.answered()).to.be.false;

        done();
    });

    it('does not return the correct answer before the question has been answered', function(done) {
        expect(question.solution()).to.be.null;

        question.answer("Wien");

        expect(question.solution()).to.not.be.null;

        done();
    });

    it('returns a number with the achieved points after answering a question', function(done) {
        expect(question.answer("Wien")).to.be.a('number');
        expect(question.points()).to.be.a('number')

        done();
    });
});