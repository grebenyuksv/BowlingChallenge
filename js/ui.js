var UI = (function () {
    "use strict";

    var UI = function () {

        var undoEnabled = false, redoEnabled = false;
        window.addEventListener('keydown', function (event) {
            event = event || window.event;
            var keyCode = event.charCode || event.keyCode;
            if (event.ctrlKey && keyCode == 90 /*z*/) {
                if (event.shiftKey) {
                    redoEnabled && trigger(publicEvents.REDO);
                } else {
                    undoEnabled && trigger(publicEvents.UNDO);
                }
            }
        });

        var rollButtons = document.querySelectorAll(".roll-button");
        for (var i = 0; i < rollButtons.length; ++i) {
            var btn = rollButtons[i];
            btn.addEventListener('click', function () {
                trigger(publicEvents.ROLL, parseInt(this.dataset.id));
            }.bind(btn));
        }

        document.querySelector(".roll-random-button").addEventListener('click', function () {
            trigger(publicEvents.ROLL_RANDOM);
        });

        document.querySelector(".fill-random-button").addEventListener('click', function () {
            trigger(publicEvents.FILL_RANDOM);
        });

        const publicEvents = {
            UNDO: "undo",
            REDO: "redo",
            ROLL: "roll",
            ROLL_RANDOM: "roll_random",
            FILL_RANDOM: "fill_random"
        };
        Object.freeze(publicEvents);

        var dataBinding = new UpdateChecker();
        var events = new PubSub();
        var trigger = function () {
            events.publish.apply(this, arguments);
            dataBinding.update();
        };

        var bindFieldToData = function (field, dataSetter, dataProvider) {
            dataBinding.watch(function (data) {
                dataSetter(field, data);
            }, dataProvider);
        };

        var resultSetter = function (node, value) {
            node.innerHTML = (typeof(value) === "number") ? value : "";
        };

        var enabledSetter = function (node, isEnabled) {
            node.style.visibility = isEnabled ? "visible" : "hidden";
        };

        var rollEnabledDataSetter = function (node, availableRolls) {
            enabledSetter(node, availableRolls > 0 && availableRolls >= parseInt(node.dataset.id));
        };

        var rollRandomEnabledDataSetter = function (node, availableRolls) {
            enabledSetter(node, availableRolls > 0);
        };

        return {
            bindFrameResults: function (resultProvider) {
                var nodes = document.querySelectorAll(".frame-result");
                for (var i = 0; i < nodes.length; ++i) {
                    bindFieldToData(nodes[i], resultSetter, resultProvider.bind(this, i));
                }
            },
            bindRollResults: function (resultProvider) {
                var frameNodes = document.querySelectorAll(".frame-result");
                for (var i = 0; i < frameNodes.length; ++i) {
                    var nodes = frameNodes[i].parentNode.querySelectorAll(".roll-result");
                    for (var j = 0; j < nodes.length; ++j) {
                        bindFieldToData(nodes[j], resultSetter, resultProvider.bind(this, i, j));
                    }
                }
            },
            bindExtraRollResults: function (resultProvider) {
                var nodes = document.querySelectorAll(".extra-roll-result");
                for (var i = 0; i < nodes.length; ++i) {
                    bindFieldToData(nodes[i], resultSetter, resultProvider.bind(this, i));
                }
            },
            bindTotalResult: function (resultProvider) {
                bindFieldToData(document.querySelector(".total"), resultSetter, resultProvider);
            },
            bindMaxRollResult: function (maxRollResultProvider) {
                var fields = document.querySelectorAll(".roll-button");
                for (var i = 0; i < fields.length; ++i) {
                    bindFieldToData(fields[i], rollEnabledDataSetter, maxRollResultProvider);
                }
                bindFieldToData(document.querySelector(".roll-random-button"), rollRandomEnabledDataSetter, maxRollResultProvider);
                bindFieldToData(document.querySelector(".fill-random-button"), rollRandomEnabledDataSetter, maxRollResultProvider);
            },
            bindUndoEnabled: function (undoEnabledProvider) {
                dataBinding.watch(function (isEnabled) {
                    undoEnabled = isEnabled;
                }, undoEnabledProvider);
            },
            bindRedoEnabled: function (redoEnabledProvider) {
                dataBinding.watch(function (isEnabled) {
                    redoEnabled = isEnabled;
                }, redoEnabledProvider);
            },
            subscribe: function (event, handler) {
                events.subscribe(event, handler);
            },
            Events: publicEvents
        };
    };

    return UI;
})();