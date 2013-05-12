var merge = require('gyp-merge');
var path = require('path');
var fs = require('fs');
var expand = require('gyp-expansions');
var loader = require('gyp-load');

var gyp = module.exports = function gyp(arg, variables) {
    if (typeof arg == 'string' || arg instanceof String) {
        arg = loader(arg);
    }

    if (typeof arg != 'object') {
        throw new Error("Root must be an object");
    }

    arg = applyExpansions(arg, variables || {}, 'pre');

    /// @todo do conditional processing

    /// @todo do post-phase expansions

    return arg;
};

function applyExpansions(arg, variables, which) {
    var m;
    if (arg.variables) {
        variables = Object.create(variables);
        for (var v in arg.variables) {
            if (m = /(.*)%$/.exec(v)) {
                if (!variables[m[1]]) {
                    variables[m[1]] = arg.variables[v];
                }
            } else {
                variables[v] = arg.variables[v];
            }
        }
    }

    arg = recurse(arg, function (o) {
        return applyExpansions(o, variables, which);
    }, function (s) {
        if (typeof s == 'string' || s instanceof String) {
            return expand(s, variables, which);
        } else {
            return s;
        }
    });

    return arg;
}

function recurse(arg, onObject, onScalar) {
    var out = {};
    for (var v in arg) {
        if (Array.isArray(arg[v])) {
            out[v] = arg[v].map(function (e) {
                return recurse(e, onObject, onScalar);
            });
        } else if (typeof arg[v] == 'object') {
            var t = onObject(arg[v]);
            out[v] = recurse(t, onObject, onScalar);
        } else {
            out[v] = onScalar(arg[v]);
        }
    }

    return out;
}
