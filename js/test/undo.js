var h = new Undo(1);
h.onUpdate(function (value, history) {
    console.log('Current:', value);
    console.log(history.canUndo(), history.canRedo());
});
h.save(2);
h.save(3);
while (h.canUndo()) {
    console.log(h.undo());
}
while (h.canRedo()) {
    console.log(h.redo());
}
while (h.canUndo()) {
    console.log(h.undo());
}
h.save(100);