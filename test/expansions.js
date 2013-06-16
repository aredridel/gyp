var test = require('tap').test;
var gyp = require('..');

test("simple expansions", function(t) {
    gyp({ a: 1, b: "<(c)" }, {c: 2}, function(err, out) {
        t.equal(out.a, "1", "a should be 1");
        t.equal(out.b, "2", "b should be 2");
        t.end();
    });
});

test("variable section expansions", function(t) {
    gyp({ a: 1, b: "<(c)", variables: { c: 2 } }, {}, function(err, out) {
        t.equal(out.a, "1", "a should be 1");
        t.equal(out.b, "2", "b should be 2");
        t.end();
    });
});

