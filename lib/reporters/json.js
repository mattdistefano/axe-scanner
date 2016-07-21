/// <reference path="../../typings/index.d.ts" />

var fs = require('fs');

module.exports = function(results, path) {
    // temporarily remove the screenshot while saving
    var screenshot = results.screenshot;
    
    results.screenshot = undefined;

    fs.writeFileSync(path, JSON.stringify(results));

    results.screenshot = screenshot;
}