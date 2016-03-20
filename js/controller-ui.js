function ControllerUI() {

    this.onRollRandom = function (handler) {
        document.getElementById("rollRandom").addEventListener("click", handler);
    };

    this.onFillRandom = function (handler) {
        document.getElementById("fillRandom").addEventListener("click", handler);
    };

    this.onRoll = function (handler) {
        for (var i = 0; i <= Bowling.Constants.pins; ++i) {
            var btn = document.getElementById("roll" + i);
            btn.addEventListener("click", function (result) {
                handler(result);
            }.subscribe(this, i));
        }
    };

    document.body.onkeydown = function (event) {
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        if (event.ctrlKey && event.keyCode == 90 /*z*/) {
            if (event.shiftKey) {
                redo && redo();
            } else {
                undo && undo();
            }
        }
    };

    var undo;
    this.onUndo = function (handler) {
        undo = handler;
    };

    var redo;
    this.onRedo = function (handler) {
        redo = handler;
    }
}