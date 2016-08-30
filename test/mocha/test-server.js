var chai = require("chai");
var chaiHttp = require("chai-http");

var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

// countries asset file
var countries = require('../../build/assets/countries.json');

// check countries file
describe('Countries file', function() {
    it('should have more than 150 countries', function(done) {
        expect(countries).to.have.length.above(150);

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