var e = new PubSub();
e.subscribe('ev', function (i) {
    console.log(i);
});
e.publish('ev', 2);