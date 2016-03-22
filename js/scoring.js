var Scoring = (function () {

    var FrameResults = (function () {

        var getPublicResult = function (result) {
            return typeof(result) === "number" && result;
        };

        var FrameResults = function (frameResults) {

            return {
                getLength: function () {
                    return frameResults.length;
                },
                getResultAt: function (frameIndex) {
                    return getPublicResult(frameResults[frameIndex]);
                },
                getUpdated: function (nextRollResult, nextFrameResult) {
                    var updatedResults = frameResults.map(function (result) {
                        return closurify(result)(nextRollResult);
                    });
                    if (nextFrameResult) {
                        updatedResults.push(nextFrameResult);
                    }
                    return new FrameResults(updatedResults);
                },
                getTotal: function () {
                    return frameResults.reduce(function (sum, frameResult) {
                        return sum + (getPublicResult(frameResult) || 0);
                    }, 0);
                }
            }
        };

        return {
            create: function () {
                return new FrameResults([]);
            }
        }
    })();

    var RollResults = function () {
        var RollResults = function (rollResults, extraRollResults) {
            return {
                getMandatoryRollResultAt: function (frameIndex, rollIndex) {
                    return rollResults[frameIndex] && rollResults[frameIndex][rollIndex];
                },
                getExtraRollResultAt: function (rollIndex) {
                    return extraRollResults[rollIndex];
                },
                getUpdated: function (nextRollResult, ifFinishedFrame, ifExtraRoll) {
                    var updatedResults = rollResults.map(function (res) {
                        return res.slice();
                    }), updatedExtraResults = extraRollResults.slice();
                    ((ifExtraRoll) ? updatedExtraResults : updatedResults[updatedResults.length - 1]).push(nextRollResult);
                    if (ifFinishedFrame) {
                        updatedResults.push([]);
                    }
                    return new RollResults(updatedResults, updatedExtraResults);
                }
            }
        };

        return new RollResults([
            []
        ], []);
    };

    var Scoring = function (frameResults, rollResults, currentRollImpl) {

        var Roll = function () {

            var frameResult, nextRollImpl;

            var rollBehaviour = {
                finishFrame: function (result) {
                    frameResult = result;
                },
                continueWith: function (rollImpl) {
                    nextRollImpl = rollImpl;
                }
            };

            this.getInfo = function () {
                return currentRollImpl.getInfo(frameResults.getLength());
            };

            this.knockDown = function (pinsCount) {
                currentRollImpl.knockDown(frameResults.getLength(), rollBehaviour, pinsCount);

//                var updatedFrameResults = frameResults.map(function (result) {
//                        return result.getUpdated(pinsCount);
//                    }),
//                    updatedRollResults = rollResults.map(function (arr) {
//                        return arr.slice();
//                    }),
//                    updatedExtraRollResults = rollResults.slice(),
//                    updatedTotal = total;

//                if (currentRollImpl.getInfo().type == Bowling.Rolls.Types.Extra) {
//                    updatedExtraRollResults.push(pinsCount);
//                } else {
//                    updatedRollResults[updatedRollResults.length - 1].push(pinsCount);
//                }
//                if (frameResult) {
//                    updatedFrameResults.push(frameResult);
//                    if (!frameResult.getValue().isWaitingForNextRolls) {
//                        updatedTotal += frameResult.getValue().points;
//                    }
//                } else {
//                    if (nextRollImpl.getInfo().type == Bowling.Rolls.Types.Mandatory) {
//                        updatedRollResults.push([]);
//                    }
//                }
                return new Scoring(
                    frameResults.getUpdated(pinsCount, frameResult),
                    rollResults.getUpdated(pinsCount, !!frameResult, currentRollImpl.getInfo().isExtra),
                    nextRollImpl);
            }
        };

        var currentRoll = currentRollImpl ? new Roll(currentRollImpl) : null;

        this.getRoll = function () {
//            console.log("current roll", JSON.stringify(currentRoll.getInfo()));
            return currentRoll;
        };

        this.getFrameResultAt = function (frameIndex) {
            return frameResults.getResultAt(frameIndex);
        };

        this.getRollResultAt = function (frameIndex, rollIndex) {
            return rollResults.getMandatoryRollResultAt(frameIndex, rollIndex);
        };

        this.getExtraRollResultAt = function (rollIndex) {
            return rollResults.getExtraRollResultAt(rollIndex);
        };

        this.getTotal = function () {
            return frameResults.getTotal();
        };
    };

    return function (firstRollImpl) {
        return new Scoring(FrameResults.create(), new RollResults(), firstRollImpl);
    };
})();