var results = [
    [2],
    [2, 3],
    [function (next) {
        return next + 5;
    }, 2]
];
for (var i = 0; i < results.length; ++i) {
    var fr = FrameResults.create();
    for (var j = 0; j < results[i].length; ++j) {
        fr = fr.getUpdated(results[i][j]);
    }
    for (var j = -1; j <= results[i].length; ++j) {
        console.log(fr.getResultAt(j));
    }
    console.log(fr.getTotal(), "-----------");
}