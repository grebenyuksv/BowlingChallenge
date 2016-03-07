var Bowling = Bowling || {};
Bowling.Rolls = {
    FirstRollOfFrame: function (score, pinsDown) {
        if (pinsDown == Bowling.Rules.pins) {
            //  strike
            score.waitForNextRolls(function (pinsDown1, pinsDown2) {
                score.addPoints(n + pinsDown1 + pinsDown2);
            });
            score.finishFrame();
            score.continueWith(FirstRollOfFrame);
        } else {
            score.continueWith(SecondRollOfFrame(pinsDown));
        }
    },

    SecondRollOfFrame: function (pinsDownInFirstRoll) {
        return function (score, pinsDown) {
            score.finishFrame();
            if (pinsDownInFirstRoll + pinsDown == Bowling.Rules.pins) {
                //  spare
                score.waitForNextRolls(function (res) {
                    score.addPoints(pinsDownInFirstRoll + pinsDown + res);
                });
            }
        }
    }
};