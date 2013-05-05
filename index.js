var merge = require('gyp-merge');
var path = require('path');
var fs = require('fs');

var loader = require('gyp-load');

var gyp = module.exports = function gyp(arg, relative) {
    if (typeof arg == 'string' || arg instanceof String) {
        arg = loader(arg);
    }

    if (typeof arg != 'object') {
        throw new Error("Root must be an object");
    }

    /// @todo do pre-phase expansions here

    /// @todo do conditional processing

    /// @todo do post-phase expansions

    return arg;
};
