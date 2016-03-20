function Controller(undo /* model */, ui) {

    ui.subscribe(ui.Events.UNDO, undo.undo.bind(undo));

    ui.subscribe(ui.Events.REDO, undo.redo.bind(undo));

    ui.subscribe(ui.Events.ROLL, function (result) {
        roll(result);
    });

    var canRoll = function () {
        return !!undo.current().getRoll();
    };

    var roll = function (result) {
        if (!canRoll()) {
            throw "Game over, cannot roll";
        }
        console.log("roll", JSON.stringify(undo.current().getRoll().getInfo()), result);
        undo.save(undo.current().getRoll().knockDown(result));
    };

    var rollRandom = function () {
        console.log('roll random');
        roll(Math.floor(Math.random() * (Bowling.Constants.pins + 1)));
    };

    ui.subscribe(ui.Events.ROLL_RANDOM, rollRandom);

    ui.subscribe(ui.Events.FILL_RANDOM, function () {
        while (undo.current().getRoll()) {
            rollRandom();
        }
    });
}