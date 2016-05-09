var cluster = require("cluster");
var numCpus = require("os").cpus().length;

cluster.setupMaster({ exec: __dirname + "/server.js" });

for (var i = 0; i < numCpus; i++) {
    cluster.fork();
}
