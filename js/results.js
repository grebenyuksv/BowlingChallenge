var Bowling = Bowling || {};
Bowling.Results = (function (Constants) {

    var Results = function (frameResults, extraRollResults, currentRollImpl, currentExtraRollImpl, pinsBeforeRoll) {

        frameResults = frameResults || [
            createEmptyFrameResult()
        ];
        extraRollResults = extraRollResults || [];
        pinsBeforeRoll = pinsBeforeRoll || Constants.pins;

        var PublicRoll = (currentRollImpl || currentExtraRollImpl) && {
            knockDown: function (pinsCount) {
                var impl = currentRollImpl || currentExtraRollImpl;

                var newFrameResult, nextRollImpl, nextExtraRollImpl, nextRollPinsBeforeRoll;
                var RollContext = {
                    finishFrame: function (result) {
                        newFrameResult = result;
                    },
                    continueWith: function (rollImpl) {
                        nextRollImpl = rollImpl;
                    },
                    continueWithExtra: function (rollImpl) {
                        nextExtraRollImpl = rollImpl;
                    },
                    limitNextRollPinsTo: function (pinsCount) {
                        nextRollPinsBeforeRoll = pinsCount;
                    },
                    getFramesDone: function () {
                        return frameResults.length;
                    },
                    getPinsBeforeRoll: function () {
                        return pinsBeforeRoll;
                    }
                };

                impl(RollContext, pinsCount);

                var newFrameResults = frameResults.map(function (frameResult) {
                    return {
                        frameResult: closurify(frameResult.frameResult)(pinsCount),
                        rollResults: frameResult.rollResults.slice()
                    }
                });

                var newExtraRollResults = extraRollResults.slice();

                //  choose a place for current roll result and save it
                (currentRollImpl ? newFrameResults[newFrameResults.length - 1].rollResults : newExtraRollResults).push(pinsCount);
                if (newFrameResult != null) {
                    newFrameResults[newFrameResults.length - 1].frameResult = newFrameResult;
                    newFrameResults.push(createEmptyFrameResult());
                }
                return new Results(newFrameResults, newExtraRollResults, nextRollImpl, nextExtraRollImpl, nextRollPinsBeforeRoll);
            },
            getPinsBeforeRoll: function () {
                return pinsBeforeRoll;
            }
        };

        return {
            getFramesDone: function () {
                return frameResults.length;
            },
            getFrameResultWithRollsAt: function (frameIndex) {
                if (frameResults[frameIndex]) {
                    var x;
                }
                return getPublicFrameResultWithRolls(frameResults[frameIndex]);
            },
            getExtraRollResultAt: function (rollIndex) {
                return extraRollResults[rollIndex];
            },
            getTotal: function () {
                return frameResults.reduce(function (sum, frameResult) {
                    return sum + (getPublicFrameResult(frameResult) || 0);
                }, 0);
            },
            getRoll: function () {
                return PublicRoll;
            }
        }
    };

    var createEmptyFrameResult = function () {
        return {rollResults: []};
    };

    var getPublicFrameResult = function (frameResult) {
        if (!frameResult) {
            return;
        }
        return typeof(frameResult.frameResult) === "number" && frameResult.frameResult;
    };

    var getPublicFrameResultWithRolls = function (frameResult) {
        return frameResult && {
            rollResults: frameResult.rollResults.slice(),
            frameResult: typeof(frameResult.frameResult) === "number" && frameResult.frameResult
        };
    };

    return {
        create: function (firstRollImpl) {
            return new Results(null, null, firstRollImpl);
        }
    }
})(Bowling.Constants);