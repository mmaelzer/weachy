(function(global) {
  function weachy(funcs, callback, context) {
    var index = 0;
    (function next(err, var_args) {
      if (err || index === funcs.length) return callback.apply(context, arguments);
      var args = arguments.length === 0 ? [next] : Array.prototype.slice.call(arguments, 1).concat(next);
      funcs[index++].apply(context, args);
    })();
  }
  if (typeof define !== 'undefined' && define.amd) {
    define(function() { return weachy; });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = weachy;
  } else {
    global.waterfall = weachy;
  }
})(this);
