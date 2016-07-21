/// <reference path="../typings/index.d.ts" />

const axeScannerTagFn = `
    window.axeScannerTag = function(selector, text) {
        var elem = document.querySelector(selector),
            rect = elem.getBoundingClientRect(),
            num = document.createElement('span');

        elem.style.cssText += "outline: 1px dashed red !important"; 
        
        num.textContent = text;
        num.className = 'axe-scanner-inserted';

        num.style.color = 'red';
        num.style.padding = '1px';
        num.style.fontSize = '11px';
        num.style.fontWeight = 'bold';
        num.style.position = 'absolute';
        num.style.background = 'rgba(255,255,255,0.75)';
        num.style.top = rect.top + window.pageYOffset - document.documentElement.clientTop + 'px';
        num.style.left = rect.left + window.pageXOffset - document.documentElement.clientLeft + 'px';
        num.style.display = 'inline-block';
        num.style.zIndex = '10000';

        document.body.appendChild(num);
    }`;

function addOrAppend(obj, key, val) {
    if (!(key in obj)) {
        obj[key] = val;
    } else {
        obj[key] += ',' + val;
    }
}

function mapViolationsBySelector(results) {
    var violationIdsBySelector = {};

    results.violations.forEach((violation, index) => {
        violation.nodes.forEach(node => {
            var selector = node.target[0];

            addOrAppend(violationIdsBySelector, selector, (index + 1) + '');
        });
    });

    return violationIdsBySelector;
}

function formatFn(selector, text) {
    return 'axeScannerTag("' + selector + '", "' + text + '");';
}

module.exports = function(driver, results) {
    var script = '',
        violationIdsBySelector = mapViolationsBySelector(results),
        promises = [];
    
    promises.push(driver.executeScript(axeScannerTagFn).then(() => {
        Object.keys(violationIdsBySelector).forEach((selector, index) => {
            script += formatFn(selector, violationIdsBySelector[selector]);
            // execute in batches of 20
            // otherwise this seems to get hung up on really large script strings
            if (index % 20 === 0) {
                promises.push(driver.executeScript(script));
                script = '';
            }
        });

        // flush whatever is left
        if (script) {
            promises.push(driver.executeScript(script));
        }
    }));

    return Promise.all(promises).then(() => driver.sleep(500));
}