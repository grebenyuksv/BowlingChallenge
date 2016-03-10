var Scoring = (function () {

    //  result is:
    //  - a number
    //  - a function(firstNextRollResult, secondNextRollResult, ...) which returns number based on the following roll results

    var FrameResult = function (result) {
        var public_result = typeof(result) == "number" ?
        {
            points: result
        } : {
            isWaitingForNextRolls: true
        };

        result = closurify(result);

        return {
            getPublic: function () {
                return public_result;
            },
            update: function (nextRollResult) {
                return new FrameResult(result(nextRollResult));
            }
        }
    };

    var Scoring = function (frameResults, currentRollImpl) {

        var Roll = function (rollImplementation) {

            var frameResult, nextRollImpl;

            var rollBehaviour = {
                finishFrame: function (result) {
                    frameResult = result;
                },
                continueWith: function (rollImpl) {
                    nextRollImpl = rollImpl;
                }
            };

            this.knockDown = function (pinsCount) {
                rollImplementation(publicResults, rollBehaviour, pinsCount);
                var updatedFrameResults = frameResults.map(function (result) {
                    return result.update(pinsCount);
                });
                if (frameResult) {
                    updatedFrameResults.push(new FrameResult(frameResult));
                }
                return new Scoring(updatedFrameResults, nextRollImpl);
            };
        };

        var currentRoll = currentRollImpl ? new Roll(currentRollImpl) : null;

        this.getRoll = function () {
            return currentRoll;
        };

        var publicResults = frameResults.map(function (frameResult) {
            return frameResult.getPublic();
        });
        this.getFrameResults = function () {
            return publicResults;
        };
    };

    return function (firstRollImpl) {
        return new Scoring([], firstRollImpl);
    };
})();