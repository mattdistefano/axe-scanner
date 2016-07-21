/// <reference path="../typings/index.d.ts" />

module.exports = url => {
    // remove protocol, replace non-alphanum with underscores, remove trailing underscores
    return url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9-]/g, '_').replace(/_+$/, '');
}