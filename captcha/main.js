import { Disk } from "./disk.js";
import { Stage } from "./stage.js";
import { Tower } from "./tower.js";
import { Timer } from "./timer.js";


// Customize disk size and colors with static variables in Disk.js
// e.g. Disk.MINIMUM_WIDTH = 100

/*
*   In each stage you can control:
*   - Number of Disks
*   - Move Limit (Optional) 
*   - Time Limit (Optional - in units of Seconds)
*   
*   Failing move and/or time limits will restart the current stage.
*/

const STAGES = [
    new Stage(3, { moveLimit: 7 }),
    new Stage(4, { timeLimit: 30 }),
    new Stage(6, { timeLimit: 150, moveLimit: 80 })
]

const TOWERS = [
    new Tower(document.getElementById("tower-left")),
    new Tower(document.getElementById("tower-center")),
    new Tower(document.getElementById("tower-right"))
]

const captchaContainer = document.getElementById("captcha-container")
const gameContainer = document.getElementById("game-container")
const mainBar = document.getElementById("main-bar")
const successBar = document.getElementById("success-bar")
const failBar = document.getElementById("fail-bar")
const infoButton = document.getElementById("info-button")
const restartButton = document.getElementById("restart-button")
const instructionText = document.getElementById("instruction-text")
const moveText = document.getElementById("move-text")
const timerText = document.getElementById("timer-text")

let stageIndex = 0
let moveCount = 0
let timer = new Timer()
timer.onTick = updateTime
timer.onFinish = handleTimeout

let selectedDisk = null
let startTower = null
let endTower = null

captchaContainer.addEventListener("contextmenu", e => e.preventDefault())
captchaContainer.addEventListener("touchmove", e => e.preventDefault())
captchaContainer.addEventListener("pointerdown", handlePickup)
captchaContainer.addEventListener("pointerup", handlePlace)
restartButton.addEventListener("click", initializeStage)
infoButton.addEventListener('click', showInstruction)

initializeStage()
showInstruction()

function initializeStage() {
    TOWERS.forEach(tower => tower.clear())
    setMoveCount(0)

    const stage = STAGES[stageIndex]

    for (let i = stage.numberOfDisks - 1; i >= 0; i--)
        TOWERS[0].place(new Disk(i))

    if (stage.hasTimeLimit()) {
        timer.setDuration(stage.timeLimit)
        timer.reset()
        updateTime()
    }

    hideInstruction()
}

function restart() {
    stageIndex = 0
    initializeStage()
}

function handlePickup(e) {
    if (!e.target.classList.contains("top") || !e.isPrimary)
        return

    startTower = TOWERS.find(tower => e.target.parentNode === tower.element)
    selectedDisk = startTower.remove()
    gameContainer.appendChild(selectedDisk.element)
    selectedDisk.element.style.left = e.pageX + "px"
    selectedDisk.element.style.top = e.pageY + "px"
    selectedDisk.element.classList.add("moving")

    captchaContainer.setPointerCapture(e.pointerId)
    captchaContainer.addEventListener("pointermove", handleMove)
}

function handlePlace(e) {
    if (selectedDisk === null)
        return

    selectedDisk.element.style.left = 0
    selectedDisk.element.style.top = 0
    selectedDisk.element.classList.remove("moving")
    captchaContainer.releasePointerCapture(e.pointerId)
    captchaContainer.removeEventListener("pointermove", handleMove)

    const towerIndex = Math.floor(e.pageX / (gameContainer.getBoundingClientRect().width / 3))
    endTower = TOWERS[towerIndex] || null

    if (endTower !== null && !endTower.equals(startTower) && endTower.canPlace(selectedDisk)) {
        endTower.place(selectedDisk)
        setMoveCount(++moveCount)
        hideInstruction()

        if (STAGES[stageIndex].hasTimeLimit()) {
            timer.start()
        }

    } else {
        startTower.place(selectedDisk)
    }

    selectedDisk = null
    startTower = null
    endTower = null


    if (STAGES[stageIndex].hasMoveLimit() && moveCount > STAGES[stageIndex].moveLimit) {
        displayFailMessage(`Must complete in ${STAGES[stageIndex].moveLimit} moves or less.`)
        initializeStage()
    }

    checkForSuccess()
}

function handleMove(e) {
    let x = e.pageX
    let y = e.pageY
    selectedDisk.element.style.left = x + "px"
    selectedDisk.element.style.top = y + "px"
}

function handleTimeout() {
    captchaContainer.removeEventListener("pointermove", handleMove)
    selectedDisk?.element.remove()
    selectedDisk = null
    startTower = null
    endTower = null
    displayFailMessage("You ran out of time!")
    initializeStage()
}

function checkForSuccess() {
    if (TOWERS[0].isEmpty() && TOWERS[1].isEmpty()) {
        timer.stop()
        const isLastStage = stageIndex === STAGES.length - 1
        stageIndex++

        if (!isLastStage) {
            displaySuccessMessage("<strong>Solved!</strong> Continue for additional verification.")
        } else {
            const randomPercent = (Math.random() * Math.random() * 100).toFixed(2)
            displaySuccessMessage(`<strong>Verified!</strong> You beat ${randomPercent}% of users!`)
        }

        setTimeout(() => {
            if (!isLastStage) {
                initializeStage()
            } else {
                window.top.postMessage("success", '*');
            }
        }, 2000);
    }
}

function setMoveCount(count) {
    moveCount = count
    moveText.textContent = moveCount === 1 ? "1 Move" : `${moveCount} Moves`
}

function updateTime() {
    timerText.textContent = STAGES[stageIndex].hasTimeLimit() ? timer.toString() : "00:00"
}

function displaySuccessMessage(html, duration = 3000) {
    const span = document.createElement("span")
    span.innerHTML = html
    successBar.appendChild(span)
    show(successBar)
    hide(mainBar)

    setTimeout(() => {
        hide(successBar)
        show(mainBar)
        successBar.removeChild(span)
    }, duration);
}

function hideInstruction() {
    hide(instructionText)
    show(infoButton)
    show(moveText)
    if (STAGES[stageIndex].hasTimeLimit()) {
        show(timerText)
    }
}

function showInstruction() {
    show(instructionText)
    hide(infoButton)
    hide(timerText)
    hide(moveText)
}

function displayFailMessage(html, duration = 3000) {
    const span = document.createElement("span")
    span.innerHTML = html
    failBar.appendChild(span)
    show(failBar)
    hide(mainBar)

    setTimeout(() => {
        hide(failBar)
        show(mainBar)
        failBar.removeChild(span)
    }, duration);
}

function hide(element) {
    element.classList.add("hidden")
}

function show(element) {
    element.classList.remove("hidden")
}