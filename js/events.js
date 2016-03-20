function Events() {
    "use strict";

    var events = {};

    var removeAll = function (array, value) {
        while (true) {
            var index = array.indexOf(value);
            if (index > -1) {
                array.splice(index, 1);
            } else {
                break;
            }
        }
    };

    this.subscribe = function (event, callback) {
        events[event] = events[event] || [];
        events[event].push(callback);
    };
    this.unsubscribe = function (event, callback) {
        events[event] && removeAll(events[event], callback);
    };
    this.trigger = function (event /* , args... */) {
        if (!events.hasOwnProperty(event) || events[event].length == 0) {
            return;
        }
        var args = new Array(arguments.length - 1);
        for (var i = 1; i < arguments.length; ++i) {
            args[i - 1] = arguments[i];
        }
        for (var i = 0; i < events[event].length; i++) {
            events[event][i].apply(this, args);
        }
    };
}