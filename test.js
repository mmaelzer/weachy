var waterfall = require('./');
var test = require('tape');

test('weachy', function(t) {
  t.plan(7);

  waterfall([
    function(done) {
      setTimeout(done.bind(null, null, 1));
    },
    function(val, done) {
      t.equal(val, 1, 'weachy passes the results from one function to the next');
      setTimeout(done.bind(null, null, val * 2));
    }
  ], function(err, results) {
    t.notOk(err, 'no error passed to the callback when no error generated');
    t.equal(results, 2, 'weachy passes the results of the last function to the callback');
  });

  waterfall([
    function(done) {
      done(null,1,2,3);
    },
    function(val1, val2, val3, done) {
      t.deepEqual([val1,val2,val3], [1,2,3], 'watchy passes multiple values to the following function');
      process.nextTick(done);
    },
    function(done) {
      process.nextTick(function() {
        done(new Error('oh noes'));
      });
    },
    function(val1, val2, done) {
      throw new Error('this should never be called');
    }
  ], function(err) {
    t.ok(err instanceof Error, 'Errors will stop the waterfall and immediately call the callback'); 
  });

  function TestObject(name) {
    this.name = name;
  }

  TestObject.prototype.getName = function() {
    return this.name;
  };

  var obj = new TestObject('foo');

  waterfall([
    function(done) {
      t.equal('foo', this.getName(), 'Context is retained in each waterfall function');
      done(null, this.name);
    }
  ], function(err, name) {
    t.equal(name, this.getName(), 'Context is retained even in the final callback');
  }, obj);
   
});
