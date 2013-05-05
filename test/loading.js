var test = require('tap').test;
var gyp = require('..');

test("parse simple dictionary", function(t) {
    var out = gyp({ a: 1, b: "test" });
    t.equal(out.a, 1, "a should be 1");
    t.equal(out.b, "test", "b should 'test'");
    t.end();
});
