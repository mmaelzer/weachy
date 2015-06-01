weachy
======

A tiny (17 lines of code) async waterfall implementation that supports CommonJS, AMD, and VanillaJS. The minified file `weachy.min.js` is just 355 bytes. 
  
[![build status](https://secure.travis-ci.org/mmaelzer/weachy.png)](http://travis-ci.org/mmaelzer/weachy)


Install
-------

#### npm
```
npm install weachy
```

#### bower
```
bower install weachy
```

Usage
-----

### waterfall(array, callback, context)

#### Arguments
* `array` - An array of functions that take a `callback(err, result1, result2, ...)` as the last argument. The arguments preceeding the callback are the results of the previous function in the array.
* `callback(err, result1, result2, ..., resultn)` - The callback that is called when all functions in the `array` are finished or an error occurs.
* `context` (optional) - The context to be used when calling each function in the `array`.

Examples
--------
#### Browser (No module loader)
```html
<script src="/js/weachy.js"></script>
<script>
  // waterfall is a global bound to the window object now
  waterfall([
    function(next) {
      done(null, 1, 2, 3);
    },
    function(num1, num2, num3, next) {
      done(null, num1 + num2, num3);
    }
  ], function(err, sum, num3) {
    console.log(sum);
    // 3
    console.log(num3);
    // 3
  });
</script>
```

#### Node.js
```javascript
var waterfall = require('weachy');
var jsdom = require('jsdom');
var fs = require('fs');

var url = process.argv[2];

waterfall([
  function(next) {
    fs.readFile('./jquery.js', 'utf-8', next);
  },
  function(jquery, next) {
    jsdom.env({
      url: url,
      src: [jquery],
      done: next
    });
  },
  function(window, next) {
    // Get a reference to jQuery
    var $ = window.$;
    var images = $('img').map(function() {
      return this.src;
    });
    // Convert a NodeList to an array
    next(null, Array.prototype.slice.call(images));
  }
], function(err, imageUrls) {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  var filename = 'images-' + Date.now() + '.txt';
  fs.writeFile(filename, imageUrls.join('\n'), function(err) {
    if (err) console.error(err);
    else console.log(filename);
    // Type coercion to go undefined|Error -> bool -> number
    process.exit(+!!err);    
  });
});
```
