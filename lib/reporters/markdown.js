/// <reference path="../../typings/index.d.ts" />

var fs = require('fs');

const crlf = '\r\n';

function formatData(data) {
    return Object.keys(data).reduce((content, key) => content += crlf + '- ' + key + ': ' + data[key], '');
}

function formatError(error) {
    return crlf + crlf + 'Check: ' + error.id + ' (' + error.impact + ')' + crlf + crlf + 'Failure: ' + error.message;
}

function formatSnippet(snippet) {
    return crlf + crlf + '    ' + snippet.replace(/\n/g, crlf + '    ');
}

function formatNode(node, index) {
    var content = crlf + crlf + '##### Element ' + (index + 1);

    content += crlf + crlf + 'Selector: `' + node.target.join(',') + '`';

    content += crlf + crlf + 'HTML snippet: ' + formatSnippet(node.html);

    node.any.concat(node.all, node.none).forEach(function(error) {
        content += formatError(error);
    });

    return content;
}

// TODO rename violation
function formatResult(result, index) {
    var content = '### ' + (index + 1) + ' ' + result.id + ' (' + result.impact + ')' + crlf + crlf + result.description;
    
    content += crlf + crlf + 'More info: [' + result.help + '](' + result.helpUrl + ')';

    content += crlf + crlf + '#### Tags' + crlf;

    result.tags.forEach(tag => {
        content += crlf + '- ' + tag;
    });

    content += crlf + crlf + '#### Affected elements';

    result.nodes.forEach((node, index) => {
        content += formatNode(node, index);
    });

    return content; 
}

module.exports = function(results, path) {
    var content = '# Axe scan results for ' + results.url + ' at ' + results.timestamp;

    content += crlf + crlf + '## Failed';

    results.violations.forEach((result, index) => {
        content += crlf + crlf + formatResult(result, index);
    });

    // content += '\r\n\r\n## Passed';

    // results.passes.forEach(function(result, index) {
    //     content += '\r\n\r\n' + formatResult(result, index);
    // });

    fs.writeFileSync(path, content);
}