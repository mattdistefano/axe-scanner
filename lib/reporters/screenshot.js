/// <reference path="../../typings/index.d.ts" />

var fs = require('fs');

module.exports = function(results, path) {
    if (results.screenshot) {
        fs.writeFileSync(path, results.screenshot, 'base64');
    }
}