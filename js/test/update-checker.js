var checker = new UpdateChecker();
checker.watch(function () {
    console.log("tick");
}, function () {
    return new Date().getSeconds();
});
setInterval(function () {
    checker.update();
}, 100);