/// <reference path="../typings/index.d.ts" />

var AxeBuilder = require('axe-webdriverjs'),
    WebDriver = require('selenium-webdriver'),
    tagFailures = require('./tagger');

var driver = new WebDriver.Builder()
    .forBrowser('firefox')
    .build();

driver.manage().timeouts().implicitlyWait(5000);

driver.manage().timeouts().setScriptTimeout(10000);

// TODO move to config
const tags = ['wcag2a', 'wcag2aa'];

function loadUrl(url) {
    return driver
        .get(url);
}

function analyze() {
    return new Promise((resolve, reject) => {
        AxeBuilder(driver)
            .withTags(tags)
            .analyze(resolve)
    });
}

function tag(results) {
    return tagFailures(driver, results).then(() => results);
}

function screenshot(results) {
    return driver.takeScreenshot().then(data => {
        results.screenshot = data;
        return results;
    }, 
    err => results);
}

module.exports = function (url) {
    return loadUrl(url)
        .then(analyze)
        .then(tag)
        .then(screenshot);
};