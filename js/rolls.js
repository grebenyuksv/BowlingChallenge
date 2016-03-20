var Bowling = Bowling || {};
Bowling.Rolls = (function () {
    var FirstRollOfFrame = {
        getInfo: function (framesDone) {
            return {
                type: TYPE_MANDATORY,
                frameIndex: framesDone,
                rollIndex: 0
            }
        },
        knockDown: function (framesDone, score, pinsDown) {
            if (pinsDown == Bowling.Constants.pins) {
                //  strike
                score.finishFrame(function (firstNextPinsDown, secondNextPinsDown) {
                    return pinsDown + firstNextPinsDown + secondNextPinsDown;
                });
                score.continueWith(framesDone < Bowling.Constants.frames ? FirstRollOfFrame : ExtraRolls(2));
            } else {
                score.continueWith(SecondRollOfFrame(pinsDown));
            }
        }
    };

    var SecondRollOfFrame = function (pinsDownInFirstRoll) {
        return {
            getInfo: function (framesDone) {
                return {
                    type: TYPE_MANDATORY,
                    frameIndex: framesDone + 1,
                    rollIndex: 1
                }
            },
            knockDown: function (framesDone, score, pinsDown) {
                if (pinsDownInFirstRoll + pinsDown == Bowling.Constants.pins) {
                    //  spare
                    score.finishFrame(function (nextPinsDown) {
                        return pinsDownInFirstRoll + pinsDown + nextPinsDown;
                    });
                    score.continueWith(framesDone < Bowling.Constants.frames ? FirstRollOfFrame : ExtraRolls(1));
                } else {
                    //  open frame
                    score.finishFrame(pinsDownInFirstRoll + pinsDown);
                    if (framesDone < Bowling.Constants.frames) {
                        score.continueWith(FirstRollOfFrame);
                    }
                }
            }
        };
    };

    var ExtraRolls = function (totalExtraRolls) {
        var ExtraRoll = function (rollIndex) {
            return {
                getInfo: function (framesDone) {
                    return {
                        type: TYPE_EXTRA,
                        rollIndex: rollIndex
                    }
                },
                knockDown: function (frameResults, score, pinsDown) {
                    if (totalExtraRolls - rollIndex > 0) {
                        score.continueWith(ExtraRoll(rollIndex + 1));
                    }
                }
            }
        };
        return ExtraRoll(1);
    };

    var TYPE_EXTRA = "extra", TYPE_MANDATORY = "mandatory";

    return {
        Types: {
            Extra: TYPE_EXTRA,
            Mandatory: TYPE_MANDATORY
        },
        FirstRollOfGame: FirstRollOfFrame
    };
})();