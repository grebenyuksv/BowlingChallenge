window.addEventListener('load', function () {
    var scoring = Bowling.Rolls.createGame();
    var model = new Undo(scoring);
    var ui = new UI();
    new View(model, ui);
    new Controller(model, ui);
});