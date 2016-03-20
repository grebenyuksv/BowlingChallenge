//  Turns a function into nested functions, which take exactly one parameter each
//  Allows passing parameters to multi-parameter function one by one
//  example usage:
//  var f = function(a,b) {...};
//  closurify(f)('A')('B')
//  returns the original function for 1- or 0-argument functions
//  for non-function argument, returns function() { return argument; }

var closurify = (function () {

    var closurify_private = function (f, length) {
        length = length || f.length;    //  support list : https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/length
        if (typeof(f) !== "function") {
            return function () {
                return f;
            };
        }
        if (length < 2) {
            return f;
        }
        return function (a) {
            return closurify_private(function (/* length - 1 arguments */) {
                var newArgs = new Array(length);
                newArgs[0] = a;
                for (var i = 1; i < length; ++i) {
                    newArgs[i] = arguments[i - 1];
                }
                return f.apply(this, newArgs);
            }, length - 1);
        };
    };

    return function (f) {
        return closurify_private(f);
    };
})();