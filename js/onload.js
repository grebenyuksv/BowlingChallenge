window.addEventListener('load', function () {
    var scoring = new Scoring(Bowling.Rolls.FirstRollOfGame);
    var model = new Undo(scoring);
    var ui = new UI();
    new View(model, ui);
    new Controller(model, ui);
});