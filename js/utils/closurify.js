//  Turns a function into nested functions, which take exactly one parameter each
//  Allows passing parameters to multi-parameter function one by one
//  example usage:
//  var f = function(a,b) {...};
//  closurify(f)('A')('B')
//  returns the original function for 1- or 0-argument functions
//  for non-function argument, returns function() { return argument; }

var closurify = function (f) {
    if (typeof(f) !== "function") {
        return function () {
            return f;
        }
    }
    if (f.length < 2) {
        return f;
    }
    return function (arg) {
        return closurify(f.bind(this, arg));
    };
};