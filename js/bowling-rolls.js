var Bowling = Bowling || {};
Bowling.Rolls = (function () {
    var FirstRollOfFrame = function (frameResults, score, pinsDown) {
        if (pinsDown == Bowling.Rules.pins) {
            //  strike
            score.finishFrame(function (firstNextPinsDown, secondNextPinsDown) {
                return pinsDown + firstNextPinsDown + secondNextPinsDown;
            });
            score.continueWith(frameResults.length + 1 < Bowling.Rules.frames ? FirstRollOfFrame : ExtraRolls(2));
        } else {
            score.continueWith(SecondRollOfFrame(pinsDown));
        }
    };

    var SecondRollOfFrame = function (pinsDownInFirstRoll) {
        return function (frameResults, score, pinsDown) {
            if (pinsDownInFirstRoll + pinsDown == Bowling.Rules.pins) {
                //  spare
                score.finishFrame(function (nextPinsDown) {
                    return pinsDownInFirstRoll + pinsDown + nextPinsDown;
                });
                score.continueWith(frameResults.length + 1 < Bowling.Rules.frames ? FirstRollOfFrame : ExtraRolls(1));
            } else {
                //  open frame
                score.finishFrame(pinsDownInFirstRoll + pinsDown);
                if (frameResults.length + 1 < Bowling.Rules.frames) {
                    score.continueWith(FirstRollOfFrame);
                }
            }
        };
    };

    var ExtraRolls = function (totalExtraRolls) {
        return function (frameResults, score, pinsDown) {
            var extraRollsLeft = totalExtraRolls - 1;
            if (extraRollsLeft > 0) {
                score.continueWith(ExtraRolls(extraRollsLeft));
            }
        };
    };

    return {
        FirstRollOfGame: FirstRollOfFrame
    };
})();