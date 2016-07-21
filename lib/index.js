/// <reference path="../typings/index.d.ts" />

var scanUrls = require('./scanner');

var urls = [
    
];

function timestampForFolder() {
    return new Date().toISOString().replace(/[:.]/g, '-');
}

scanUrls(urls, './reports/' + timestampForFolder() + '/');