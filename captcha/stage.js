export class Stage {
    static MINIMUM_TIME_LIMIT = 10

    constructor(numberOfDisks = 3, params = { moveLimit: null, timeLimit: null }) {
        this.numberOfDisks = numberOfDisks < 1 ? 1 : numberOfDisks
        const optimalMoveCount = Math.pow(2, this.numberOfDisks) - 1

        if (params.moveLimit != null && params.moveLimit < optimalMoveCount)
            this.moveLimit = optimalMoveCount
        else
            this.moveLimit = params.moveLimit

        if (params.timeLimit != null && params.timeLimit < Stage.MINIMUM_TIME_LIMIT)
            this.timeLimit = Stage.MINIMUM_TIME_LIMIT
        else
            this.timeLimit = params.timeLimit
    }

    hasTimeLimit() {
        return this.timeLimit != null
    }

    hasMoveLimit() {
        return this.moveLimit != null
    }
}