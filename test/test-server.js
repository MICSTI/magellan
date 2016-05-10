var chai = require("chai");
var chaiHttp = require("chai-http");

var should = chai.should();

chai.use(chaiHttp);

// we mock the server for now
var server = new function() {
    this.greet = function(name) {
        return "Hello " + name;
    };

    this.getUsers = function() {
        return [{
            id: 1,
            username: "nodejs",
            name: "Node"
        }, {
            id: 2,
            username: "angular"
        }];
    };
};

describe("Server tests", function() {
    it("should say hello", function(done) {
        var greeting = server.greet("Magellan");

        greeting.should.equal("Hello Magellan");

        done();
    });

    it("should return users", function(done) {
        var users = server.getUsers();

        users.should.be.an("array");
        users[0].should.be.an("object");
        users[0].should.have.property("id");
        users[0].should.have.property("username");
        users[1].username.should.equal("angular");

        done();
    });
});