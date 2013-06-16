var merge = require('gyp-merge');
var path = require('path');
var fs = require('fs');
var expansions = require('gyp-expansions');
var load = require('gyp-load');

var gyp = module.exports = function gyp(arg, variables, cb) {
    if (typeof arg == 'string' || arg instanceof String) {
        arg = load(arg);
    }

    if (typeof arg != 'object') {
        throw new Error("Root must be an object");
    }

    recurse(arg, variables, 'pre', cb);

    return;

    /// @todo do conditional processing

    /// @todo do post-phase expansions

    cb(null, arg);
};

function recurse(obj, variables, which, cb) {
    oiter(obj, function(e, c) {
        handle(e, variables, which, c);
    }, cb);
}

function oiter(obj, proc, cb) {
    var done = 0;
    var result = {};
    var length = Object.keys(obj).length;
    for (var i in obj) {
        (function(j) {
            setImmediate(function() {
                proc(obj[j], function(err, res) {
                    if (err) cb(err);
                    result[j] = res;
                    if (++done == length) cb(null, result);
                });
            });
        })(i);
    }
}

function handle(thing, variables, which, cb) {
    if (Array.isArray(thing)) {
        expansions.expandArray(thing, variables, which, function (err, res) {
            cb(null, (typeof res != 'undefined' ? res : thing).map(function (e) {
                return recurse(e, variables);
            }));
        });
    } else if (typeof thing == 'object') {
        var m;
        var out = {};
        if (thing.variables) {
            variables = Object.create(variables);
            for (var v in thing.variables) {
                if (m = /(.*)%$/.exec(v) && !variables[m[1]]) {
                    variables[m[1]] = thing.variables[v];
                } else {
                    variables[v] = thing.variables[v];
                }
            }
        }

        if (thing.conditions) {
        }

        for (var v in thing) {
            if (v != 'variables') continue;
            out[v] = recurse(thing[v], variables);
        }

        cb(null, out);
    } else {
        thing = "" + thing;
        expansions.expandString(thing, variables, which, function(err, res) {
            cb(null, typeof res != 'undefined' ? res : thing);
        });
    }
}
