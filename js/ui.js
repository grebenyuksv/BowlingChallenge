var UI = (function (Constants) {
    "use strict";

    var UI = function () {

        const strikeSymbol = "✕", spareSymbol = "/";

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
        document.querySelector(".undo-button").addEventListener("click", function () {
            trigger(publicEvents.UNDO);
        });
        document.querySelector(".redo-button").addEventListener("click", function () {
            trigger(publicEvents.REDO);
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
            node.innerHTML = (typeof(value) === "number" || (typeof(value) === "string")) ? value : "";
        };

        var frameResultSetter = function (frameIndex) {
            return function (frameResultNode, value) {
                resultSetter(frameResultNode, value && value.frameResult);
                var rollResultNodes = frameResultNode.parentNode.querySelectorAll(".roll-result");
                var rollResults = value && value.rollResults || [];
                if (rollResults[0] == Constants.pins) {
                    if (frameIndex < Constants.frames - 1) {
                        resultSetter(rollResultNodes[1], strikeSymbol);
                    } else {
                        resultSetter(rollResultNodes[0], strikeSymbol);
                    }
                } else {
                    resultSetter(rollResultNodes[0], rollResults[0]);
                    resultSetter(rollResultNodes[1], (rollResults[0] + rollResults[1] == Constants.pins) ? spareSymbol : rollResults[1]);
                }
            }
        };

        var extraRollResultSetter = function (nodes, rollResults) {
            resultSetter(nodes[0], rollResults[0] == Constants.pins ? strikeSymbol : rollResults[0]);
            resultSetter(nodes[1], rollResults[1] == Constants.pins ? strikeSymbol : rollResults[1]);
        };

        var enabledSetter = function (node, isEnabled) {
            node.style.visibility = isEnabled ? "visible" : "hidden";
        };

        var rollEnabledSetter = function (node, availableRolls) {
            enabledSetter(node, availableRolls > 0 && availableRolls >= parseInt(node.dataset.id));
        };

        var rollRandomEnabledDataSetter = function (node, availableRolls) {
            enabledSetter(node, availableRolls > 0);
        };

        return {
            bindFrameResultsWithRolls: function (resultProvider) {
                var nodes = document.querySelectorAll(".frame-result");
                for (var i = 0; i < nodes.length; ++i) {
                    bindFieldToData(nodes[i], frameResultSetter(i), resultProvider.bind(this, i));
                }
            },
            bindExtraRollResults: function (resultProvider) {
                var nodes = document.querySelectorAll(".extra-roll-result");
                bindFieldToData(nodes, extraRollResultSetter, resultProvider);
            },
            bindTotalResult: function (resultProvider) {
                bindFieldToData(document.querySelector(".total"), resultSetter, resultProvider);
            },
            bindMaxRollResult: function (maxRollResultProvider) {
                var fields = document.querySelectorAll(".roll-button");
                for (var i = 0; i < fields.length; ++i) {
                    bindFieldToData(fields[i], rollEnabledSetter, maxRollResultProvider);
                }
                bindFieldToData(document.querySelector(".roll-random-button"), rollRandomEnabledDataSetter, maxRollResultProvider);
                bindFieldToData(document.querySelector(".fill-random-button"), rollRandomEnabledDataSetter, maxRollResultProvider);
            },
            bindUndoEnabled: function (undoEnabledProvider) {
                dataBinding.watch(function (isEnabled) {
                    undoEnabled = isEnabled;
                    enabledSetter(document.querySelector(".undo-button"), isEnabled);
                }, undoEnabledProvider);
            },
            bindRedoEnabled: function (redoEnabledProvider) {
                dataBinding.watch(function (isEnabled) {
                    redoEnabled = isEnabled;
                    enabledSetter(document.querySelector(".redo-button"), isEnabled);
                }, redoEnabledProvider);
            },
            subscribe: function (event, handler) {
                events.subscribe(event, handler);
            },
            Events: publicEvents
        };
    };

    return UI;
})(Bowling.Constants);