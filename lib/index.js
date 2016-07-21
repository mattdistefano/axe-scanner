/// <reference path="../typings/index.d.ts" />

var scanUrls = require('./scanner');

var urls = [
    'https://www.wsecu.org'
];

function timestampForFolder() {
    return new Date().toISOString().replace(/[:.]/g, '-');
}

scanUrls(urls, './reports/' + timestampForFolder() + '/');