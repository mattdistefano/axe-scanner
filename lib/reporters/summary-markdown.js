var fs = require('fs');

const crlf = '\r\n';

function formatResults(results) {
    var content = crlf + crlf + '## ' + results.url + ' - failed: ' + results.violations.length + ' passed: ' + results.passes.length;

    content += crlf;

    if (results.violations.length) {
        results.violations.forEach(violation => content += crlf + '- ' + violation.id + ' (' + violation.impact + ') ' + violation.nodes.length + ' occurrence' + (violation.nodes.length > 1 ? 's' : ''));
    }

    return content;
}

module.exports = function(allResults, path) {
    var content = '# Axe scan result summary';

    allResults.forEach(results => content += formatResults(results));

    fs.writeFileSync(path, content);
}