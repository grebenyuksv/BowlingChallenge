function Controller(model, ui) {

    ui.subscribe(ui.Events.UNDO, model.undo.bind(model));

    ui.subscribe(ui.Events.REDO, model.redo.bind(model));

    ui.subscribe(ui.Events.ROLL, function (result) {
        model.save(roll(model.current(), result));
    });

    var canRoll = function () {
        return !!model.current().getRoll();
    };

    var roll = function (scoring, result) {
        if (!canRoll()) {
            throw "Game over, cannot roll";
        }
        return scoring.getRoll().knockDown(result);
    };

    var rollRandom = function (scoring) {
        return roll(scoring, Math.floor(Math.random() * scoring.getRoll().getInfo().pinsAtStart + 1));
    };

    ui.subscribe(ui.Events.ROLL_RANDOM, function () {
        model.save(rollRandom(model.current()));
    });

    ui.subscribe(ui.Events.FILL_RANDOM, function () {
        var scoring = model.current();
        while (scoring.getRoll()) {
            scoring = rollRandom(scoring);
        }
        model.save(scoring);
    });
}