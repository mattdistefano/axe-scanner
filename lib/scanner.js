/// <reference path="../typings/index.d.ts" />

var analyzeUrl = require('./analyzer'),
    writeMdReport = require('./reporters/markdown'),
    writeJsonReport = require('./reporters/json'),
    writeScreenshot = require('./reporters/screenshot'),
    writeMdSummary = require('./reporters/summary-markdown'),
    urlToName = require('./url-to-name'),
    fs = require('fs');

module.exports = function(urls, reportPath) {
    if (!fs.existsSync(reportPath)) {
        fs.mkdirSync(reportPath);
    }

    function report(results) {
        var p = reportPath + urlToName(results.url);

        writeMdReport(results, p + '.md');
        writeJsonReport(results, p + '.json');
        writeScreenshot(results, p+ '.png');

        return Promise.resolve(results);
    }

    Promise.all(
        urls.map(url => analyzeUrl(url).then(report))
    ).then(allResults => writeMdSummary(allResults, reportPath + 'summary.md'));
}