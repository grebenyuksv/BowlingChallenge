var Bowling = Bowling || {};
Bowling.Rolls = (function () {
    var FirstRollOfFrame = {
        getInfo: function (framesDone) {
            return {
                pinsAtStart: Bowling.Constants.pins,
                isExtra: false,
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
                score.continueWith(framesDone + 1 < Bowling.Constants.frames ? FirstRollOfFrame : ExtraRolls(2));
            } else {
                score.continueWith(SecondRollOfFrame(pinsDown));
            }
        }
    };

    var SecondRollOfFrame = function (pinsDownInFirstRoll) {
        return {
            getInfo: function (framesDone) {
                return {
                    pinsAtStart: Bowling.Constants.pins - pinsDownInFirstRoll,
                    isExtra: false,
                    frameIndex: framesDone,
                    rollIndex: 1
                };
            },
            knockDown: function (framesDone, score, pinsDown) {
                if (pinsDownInFirstRoll + pinsDown == Bowling.Constants.pins) {
                    //  spare
                    score.finishFrame(function (nextPinsDown) {
                        return pinsDownInFirstRoll + pinsDown + nextPinsDown;
                    });
                    score.continueWith(framesDone + 1 < Bowling.Constants.frames ? FirstRollOfFrame : ExtraRolls(1));
                } else {
                    //  open frame
                    score.finishFrame(pinsDownInFirstRoll + pinsDown);
                    if (framesDone + 1 < Bowling.Constants.frames) {
                        score.continueWith(FirstRollOfFrame);
                    }
                }
            }
        };
    };

    var ExtraRolls = function (totalExtraRolls) {
        var ExtraRoll = function (rollIndex, pinsAtStart) {
            return {
                getInfo: function (framesDone) {
                    return {
                        pinsAtStart: pinsAtStart,
                        isExtra: true,
                        rollIndex: rollIndex
                    };
                },
                knockDown: function (frameResults, score, pinsDown) {
                    if (totalExtraRolls - rollIndex > 1) {
                        score.continueWith(ExtraRoll(rollIndex + 1, (pinsAtStart - pinsDown) || Bowling.Constants.pins));
                    }
                }
            }
        };
        return ExtraRoll(0, Bowling.Constants.pins);
    };

    return {
        FirstRollOfGame: FirstRollOfFrame
    };
})();