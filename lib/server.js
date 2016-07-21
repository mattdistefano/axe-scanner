/// <reference path="../typings/index.d.ts" />

var http = require('http'),
    ecstatic = require('ecstatic');

module.exports = function(path, port) {
    port = port || 8080;

    var server = http.createServer(
        ecstatic({ root: path })
    ).listen(port);

    return server;
}