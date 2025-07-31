export class Stage {
    constructor(numberOfDisks = 3, params = { moveLimit: null, timeLimit: null}) {
        this.numberOfDisks = numberOfDisks
        this.moveLimit = params.moveLimit 
        this.timeLimit = params.timeLimit
    }

    hasTimeLimit() {
        return this.timeLimit != null
    }

    hasMoveLimit() {
        return this.moveLimit != null
    }
}