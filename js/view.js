function View(model /* Undo instance */, ui) {

    ui.bindRollResults(function (i, j) {
        return model.current().getRollResult(i, j);
    });
    ui.bindFrameResults(function (i) {
        var res = model.current().getFrameResult(i);
        return res && !res.isWaitingForNextRolls && res.points;
    });
}