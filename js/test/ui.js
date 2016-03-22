window.addEventListener('load', function () {
    var ui = new UI();
    var cnt = 0;
    ui.bindFrameResults(function (i) {
        return i + cnt;
    });
    ui.bindRollResults(function (i, j) {
        return i + j + cnt;
    });
    ui.bindExtraRollResults(function (i) {
        return i * 100 + cnt;
    });

    ui.bindTotalResult(100);

    ui.bindMaxRollResult(function () {
        return cnt;
    });
    ui.bindUndoEnabled(function () {
        return cnt < 10;
    });
    ui.bindRedoEnabled(function () {
        return cnt > 0;
    });
    ui.subscribe(ui.Events.UNDO, function () {
        --cnt;
    });
    ui.subscribe(ui.Events.REDO, function () {
        ++cnt;
    });
});