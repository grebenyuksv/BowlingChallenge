var Bowling = Bowling || {};
Bowling.Rolls = (function (Results, Constants) {

    var FirstRollOfFrame = function (context, pinsDown) {
        if (pinsDown == Constants.pins) {
            //  strike
            context.finishFrame(function (firstNextPinsDown, secondNextPinsDown) {
                return Constants.pins + firstNextPinsDown + secondNextPinsDown;
            });
            if (context.getFramesDone() < Constants.frames) {
                context.continueWith(FirstRollOfFrame);
            } else {
                context.continueWithExtra(ExtraRolls(2));
            }
        } else {
            context.limitNextRollPinsTo(Constants.pins - pinsDown);
            context.continueWith(SecondRollOfFrame);
        }
    };

    var SecondRollOfFrame = function (context, pinsDown) {
        if (context.getPinsBeforeRoll() == pinsDown) {
            //  spare
            context.finishFrame(function (nextPinsDown) {
                return Constants.pins + nextPinsDown;
            });
            if (context.getFramesDone() < Constants.frames) {
                context.continueWith(FirstRollOfFrame);
            } else {
                context.continueWithExtra(ExtraRolls(1));
            }
        } else {
            //  open frame
            context.finishFrame(Constants.pins - context.getPinsBeforeRoll() + pinsDown);
            if (context.getFramesDone() < Constants.frames) {
                context.continueWith(FirstRollOfFrame);
            }
        }
    };

    var ExtraRolls = function (totalExtraRollsLeft) {
        return function (context, pinsDown) {
            if (--totalExtraRollsLeft > 0) {
                context.limitNextRollPinsTo((context.getPinsBeforeRoll() - pinsDown) || Bowling.Constants.pins);
                context.continueWithExtra(ExtraRolls(totalExtraRollsLeft));
            }
        }
    };

    return {
        createGame: function () {
            return Results.create(FirstRollOfFrame);
        }
    };
})(Bowling.Results, Bowling.Constants);