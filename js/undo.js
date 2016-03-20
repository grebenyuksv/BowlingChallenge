function Undo(initialMemento) {

    var mementos = [initialMemento], currentIndex = 0, MAX_SIZE = 20;

    this.save = function (memento) {
        mementos.splice(++currentIndex, mementos.length /* delete all */, memento);
        currentIndex -= mementos.splice(1, mementos.length - MAX_SIZE).length;
        onUpdated();
    };

    this.undo = function () {
        if (this.canUndo()) {
            --currentIndex;
            onUpdated();
        }
    };

    this.redo = function () {
        if (this.canRedo()) {
            --currentIndex;
            onUpdated();
        }
    };

    this.canUndo = function () {
        return currentIndex > 0;
    };

    this.canRedo = function () {
        return currentIndex < mementos.length - 1;
    };

    this.current = function () {
        return mementos[currentIndex];
    };

    this.size = function () {
        return mementos.size - 1;   //  -initial
    };

    var events = new Events(), event = "getUpdated";

    var onUpdated = function () {
        events.trigger(event, this.current(), this);
    }.bind(this);

    this.onUpdate = function (callback /* function(memento, history) */) {
        events.subscribe(event, callback);
    };
}
