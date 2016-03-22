function View(model /* Undo instance */, ui) {
    ui.bindRollResults(function (i, j) {
        return model.current().getRollResultAt(i, j);
    });
    ui.bindFrameResults(function (i) {
        return model.current().getFrameResultAt(i);
    });
    ui.bindExtraRollResults(function (i) {
        return model.current().getExtraRollResultAt(i);
    });
    ui.bindTotalResult(function() {
        return model.current().getTotal();
    });
    ui.bindMaxRollResult(function() {
        var roll = model.current().getRoll();
        return roll ? roll.getInfo().pinsAtStart : 0;
    });
    ui.bindUndoEnabled(model.canUndo.bind(model));
    ui.bindRedoEnabled(model.canRedo.bind(model));
}