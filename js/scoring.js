var Scoring = (function () {

    var FrameResults = function () {

        //  result may be:
        //  - a number
        //  - a function(firstNextRollResult, secondNextRollResult, ...) which returns number based on the following roll results

        var FrameResult = function (result) {
            var isWaitingForNextRolls = typeof(result) !== "number";

            return {
                getValue: function () {
                    return isWaitingForNextRolls ? { isWaitingForNextRolls: true} : {points: result};
                },
                getUpdated: function (nextRollResult) {
                    return isWaitingForNextRolls ? new FrameResult(closurify(result)(nextRollResult)) : this;
                }
            }
        };

        var private_constructor = function (frameResults) {
            return {
                getLength: function () {
                    return frameResults.length;
                },
                getResultAt: function (frameIndex) {
                    return frameResults[frameIndex] && frameResults[frameIndex].getValue() || null;
                },
                getUpdated: function (nextRollResult, nextFrameResult) {
                    var updatedResults = frameResults.map(function (res) {
                        return res.getUpdated(nextRollResult);
                    });
                    if (nextFrameResult) {
                        updatedResults.push(new FrameResult(nextFrameResult));
                    }
                    return new private_constructor(updatedResults);
                },
                getTotal: function () {
                    return frameResults.reduce(function (sum, frameResult) {
                        if (!frameResult.isWaitingForNextRolls) {
                            sum += frameResult.points;
                        }
                        return sum;
                    }, 0);
                }
            }
        };

        return new private_constructor([]);
    };

    var RollResults = function () {
        var private_constructor = function (rollResults, extraRollResults) {
            return {
                getMandatoryRollResultAt: function (frameIndex, rollIndex) {
                    var res = rollResults[frameIndex] && rollResults[frameIndex][rollIndex];
                    return typeof(res) === "number" ? res : null;
                },
                getExtraRollResultAt: function (rollIndex) {
                    return rollResults[rollIndex];
                },
                getUpdated: function (nextRollResult, ifFinishedFrame, ifExtraRoll) {
                    var updatedResults = rollResults.map(function (res) {
                        return res.slice();
                    }), updatedExtraResults = extraRollResults.slice();
                    ((ifExtraRoll) ? updatedExtraResults : updatedResults[updatedResults.length - 1]).push(nextRollResult);
                    if (ifFinishedFrame) {
                        updatedResults.push([]);
                    }
                    return new private_constructor(updatedResults, updatedExtraResults);
                }
            }
        };

        return new private_constructor([
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
                    rollResults.getUpdated(pinsCount, !!frameResult, currentRollImpl.getInfo().type === Bowling.Rolls.Types.Extra),
                    nextRollImpl);
            }
        };

        var currentRoll = currentRollImpl ? new Roll(currentRollImpl) : null;

        this.getRoll = function () {
//            console.log("current roll", JSON.stringify(currentRoll.getInfo()));
            return currentRoll;
        };

        this.getFrameResult = function (frameIndex) {
            return frameResults.getResultAt(frameIndex);
        };

        this.getRollResult = function (frameIndex, rollIndex) {
            return rollResults.getMandatoryRollResultAt(frameIndex, rollIndex);
        };

        this.getExtraRollResult = function (rollIndex) {
            return rollResults.getExtraRollResultAt(rollIndex);
        };

        this.getTotal = function () {
            return frameResults.getTotal();
        };
    };

    return function (firstRollImpl) {
        return new Scoring(new FrameResults(), new RollResults(), firstRollImpl);
    };
})();