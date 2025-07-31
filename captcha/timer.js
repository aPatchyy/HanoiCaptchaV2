export class Timer {
    constructor(duration) {
        this.startTime = duration
        this.time = duration
        this.timerId = null
        this.isRunning = false
        this.onTick = null
        this.onFinish = null
    }

    start() {
        if(this.isRunning)
            return
        this.isRunning = true
        this.timerId = setInterval(() => {
            this.time--
            if(this.onTick !== null)
                this.onTick()
            if(this.time <= 0) {
                this.stop()
                if(this.onFinish !== null)
                    this.onFinish()
            }
        }, 1000);

    }

    stop() {
        if(!this.isRunning)
            return
        this.isRunning = false
        clearInterval(this.timerId)
        this.timerId = null
    }

    reset() {
        this.stop()
        this.time = this.duration
    }

    setDuration(duration) {
        this.duration = duration
    }

    toString() {
        const hours = Math.floor(this.time / 3600)
        const minutes = Math.floor((this.time % 3600) / 60)
        const seconds = Math.floor((this.time % 3600) % 60)
        if(hours > 0) {
            const hoursString =  String(hours).padStart(2, '0')
            const minutesString = String(minutes).padStart(2, '0')
            const secondsString = String(seconds).padStart(2, '0')
            return `${hoursString}:${minutesString}:${secondsString}`;
        } else {
            const minutesString = String(minutes).padStart(2, '0')
            const secondsString = String(seconds).padStart(2, '0')
            return `${minutesString}:${secondsString}`;
        }
    }
}