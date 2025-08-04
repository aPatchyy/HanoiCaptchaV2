export class Stage {
    static MINIMUM_TIME_LIMIT = 10

    constructor({numberOfDisks, moveLimit, timeLimit} = {numberOfDisks: 3}) {
        if(numberOfDisks == null || numberOfDisks < 1) {
            this.numberOfDisks = 1
        } else {
            this.numberOfDisks = numberOfDisks
        }

        const optimalMoveCount = Math.pow(2, this.numberOfDisks) - 1
        if(moveLimit != null && moveLimit < optimalMoveCount) {
            this.moveLimit = optimalMoveCount
        } else {
            this.moveLimit = moveLimit
        }

        if(timeLimit != null && timeLimit < Stage.MINIMUM_TIME_LIMIT) {
            this.timeLimit = Stage.MINIMUM_TIME_LIMIT
        } else {
            this.timeLimit = timeLimit
        }
        
    }

    hasTimeLimit() {
        return this.timeLimit != null
    }

    hasMoveLimit() {
        return this.moveLimit != null
    }
}