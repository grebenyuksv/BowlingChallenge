//  simple Publisher-Subscriber implementation

function PubSub() {
    "use strict";

    var subscribers = {};

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
        subscribers[event] = subscribers[event] || [];
        subscribers[event].push(callback);
    };
    this.unsubscribe = function (event, callback) {
        subscribers[event] && removeAll(subscribers[event], callback);
    };
    this.publish = function (event /* , args... */) {
        if (!subscribers.hasOwnProperty(event) || subscribers[event].length == 0) {
            return;
        }
        var args = new Array(arguments.length - 1);
        for (var i = 1; i < arguments.length; ++i) {
            args[i - 1] = arguments[i];
        }
        for (var i = 0; i < subscribers[event].length; i++) {
            subscribers[event][i].apply(this, args);
        }
    };
}