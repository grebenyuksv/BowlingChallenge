var Bowling = Bowling || {};
Bowling.Score = (function () {

    var Score = function (previousScore) {

        var frameDone = false, pointsScored = 0, nextRollsCallback, nextRollImplementation;

        var modifiers = {
            finishFrame: function () {
                frameDone = true;
            },
            addPoints: function (points) {
                pointsScored = points;
            },
            waitForNextRolls: function (callback) {
                nextRollsCallback = callback;
            },
            continueWith: function (rollImplementation) {
                nextRollImplementation = rollImplementation;
            }
        };

        var Roll = function (score, modifiers, rollImplementation) {
            this.knockDown = function (pinsDown) {
                //  score.notifyKnockedDown(pinsDown);
                //  rollImplementation(modifiers, pinsDown);
                return score;
            }
        };

        this.getRoll = function () {
            return new Roll(new Score(this), modifiers, nextRollImplementation);
        };

        this.getPoints = function () {
            return pointsScored + (previousScore ? previousScore.getPoints() : 0);
        };

        this.getCompletedFramesCount = function () {
            return (frameDone ? 1 : 0) + (previousScore ? previousScore.getCompletedFramesCount() : 0);
        };

        this.hasWaitingFrames = function () {
            return !frameDone || (previousScore && previousScore.hasWaitingFrames());
        };
    };

    return {
        create: function () {
            return new Score(null);
        }
    };
})();