var closures = closurify(
    function (a, b, c, d) {
        console.log(a, b, c, d);
    }
);
closures('A')('B')('C')('D');

var closures = closurify(
    function (a) {
        console.log(a);
    }
);
closures('A');

var closures = closurify(
    function () {
        console.log('void');
    }
);
closures();

var closures = closurify(
    5
);
console.log(closures());