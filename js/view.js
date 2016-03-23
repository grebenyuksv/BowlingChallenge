function View(model /* Undo instance */, ui) {
//    ui.bindRollResults(function (i, j) {
//        var frameResult = model.current().getFrameResultWithRollsAt(i);
//        return frameResult && frameResult.rollResults[j];
//    });
//    ui.bindFrameResults(function (i) {
//        var frameResult = model.current().getFrameResultWithRollsAt(i);
//        return frameResult && frameResult.frameResult;
//    });
    ui.bindFrameResultsWithRolls(function(i) {
        return model.current().getFrameResultWithRollsAt(i);
    });
    ui.bindExtraRollResults(function () {
        return model.current().getExtraRollResults();
    });
    ui.bindTotalResult(function () {
        return model.current().getTotal();
    });
    ui.bindMaxRollResult(function () {
        var roll = model.current().getRoll();
        return roll ? roll.getPinsBeforeRoll() : 0;
});
    ui.bindUndoEnabled(model.canUndo.bind(model));
    ui.bindRedoEnabled(model.canRedo.bind(model));
}