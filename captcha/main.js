import { COLORS } from "./colors.js"
import { Stage } from "./stage.js"
import { Timer } from "./timer.js"
import { Tower } from "./tower.js"
import {Disk, createDiskElement} from "./disk.js"

/*
*   In each stage you can control:
*   - Number of Disks
*   - Move Limit (Optional)
*   - Time Limit (Optional)
*   
*   Failing either move or time limits will restart the active stage.
*/
const STAGES = [
    new Stage(3, {moveLimit: 7}),
    new Stage(4, {timeLimit: 30}),
    new Stage(6, {timeLimit: 90, moveLimit: 100})
]

const DISK_MIN_WIDTH = 50   //  Width of smallest disk
const DISK_STEP_SIZE = 10   //  How much each additional disk get incrementally wider.
const DISK_HEIGHT = 26  //  Disk height / thickness


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
let timer = null
let selectedDisk = null
let startTower = null
let endTower = null

captchaContainer.addEventListener("pointerdown", handlePickup)
captchaContainer.addEventListener("pointerup", handlePlace)
captchaContainer.addEventListener("touchmove", e => e.preventDefault())
captchaContainer.addEventListener("contextmenu", e => e.preventDefault())
restartButton.addEventListener("click", restartStage)
infoButton.addEventListener('click', showInstruction)

function handlePickup(e) {
    if(!e.target.classList.contains("top") || !e.isPrimary)
        return

    startTower = TOWERS.find(tower => e.target.parentNode === tower.element)
    selectedDisk = startTower.removeDisk(selectedDisk)
    
    gameContainer.appendChild(selectedDisk.element)

    let x = e.pageX
    let y = e.pageY
    selectedDisk.element.style.left = x + "px"
    selectedDisk.element.style.top = y + "px"
    selectedDisk.element.classList.add("moving")

    captchaContainer.setPointerCapture(e.pointerId)
    captchaContainer.addEventListener("pointermove", handleMove)
}

function handlePlace(e) {
    if(selectedDisk === null)
        return

    selectedDisk.element.style.left = 0
    selectedDisk.element.style.top = 0
    selectedDisk.element.classList.remove("moving")
    captchaContainer.releasePointerCapture(e.pointerId)
    captchaContainer.removeEventListener("pointermove", handleMove)

    const towerIndex = Math.floor(e.pageX / (gameContainer.getBoundingClientRect().width/3))
    endTower = TOWERS[towerIndex] || null
    
    if(endTower !== null && !endTower.equals(startTower) && endTower.canPlace(selectedDisk)) {
        endTower.placeDisk(selectedDisk)
        moveCount++
        updateMoves()
        
        hideInstruction()

        if(STAGES[stageIndex].hasTimeLimit()) {
            timer.start()
        }

    } else {
        startTower.placeDisk(selectedDisk)
    }

    selectedDisk = null
    startTower = null
    endTower = null

    
    if(STAGES[stageIndex].hasMoveLimit() && moveCount > STAGES[stageIndex].moveLimit) {
        displayFailMessage(`Must complete in ${STAGES[stageIndex].moveLimit} moves or less.`)
        restartStage()
    }
    
    checkForSuccess()
}

function handleMove(e) {
    let x = e.pageX
    let y = e.pageY
    selectedDisk.element.style.left = x + "px"
    selectedDisk.element.style.top = y + "px"
}

function checkForSuccess() {
    if(!TOWERS[0].hasDisk() && !TOWERS[1].hasDisk()) {
        timer?.stop()
        const lastStage = stageIndex === STAGES.length - 1
        stageIndex++
        if(!lastStage) {
            displaySuccessMessage("<strong>Solved!</strong> Continue for additional verification.")
        } else {
            let randomPercent = (Math.random() * 100).toFixed(2)
            displaySuccessMessage(`<strong>Verified!</strong> You beat ${randomPercent}% of users!`)
        }
        
        setTimeout(() => {
            if(stageIndex < STAGES.length) {
                restartStage()
            } else {
                window.top.postMessage("success", '*');
            }
        }, 2000);
    }
}

function initializeStage() {
    const currentStage = STAGES[stageIndex]
    for (let i = currentStage.numberOfDisks; i > 0; i--) {
        const color = COLORS[(i - 1) % COLORS.length]
        const newDisk = new Disk(createDiskElement(DISK_MIN_WIDTH + DISK_STEP_SIZE * i, DISK_HEIGHT, color, 1), i)
        TOWERS[0].placeDisk(newDisk)
    }

    moveCount = 0
    updateMoves()

    if(currentStage.hasTimeLimit()) {
        if(timer === null) {
            timer = new Timer(currentStage.timeLimit)
            timer.onTick = updateTime
            timer.onFinish = () => {
                captchaContainer.removeEventListener("pointermove", handleMove)
                selectedDisk?.element.remove()
                selectedDisk = null
                displayFailMessage("You ran out of time!")
                restartStage()
            }
        } else {
            timer.setDuration(currentStage.timeLimit)
            timer.reset()
        }
        updateTime() 
    } else {
        timer = null
    }
}
initializeStage()

function restartStage() {
    TOWERS.forEach(tower => tower.removeAllDisks())
    hideInstruction()
    initializeStage()
}

function restartGame() {
    stageIndex = 0
    restartStage()
}

function updateMoves() {
    moveText.textContent = moveCount === 1 ? "1 Move" : `${moveCount} Moves`
}

function updateTime() {
    timerText.textContent = STAGES[stageIndex].hasTimeLimit() ? timer.toString() : "00:00"
}

function showInstruction() {
    show(instructionText)
    hide(infoButton)
    hide(timerText)
    hide(moveText)
}

function hideInstruction() {
    hide(instructionText)
    show(infoButton)
    show(moveText)
    if(STAGES[stageIndex].hasTimeLimit()) {
        show(timerText)
    }
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

function hide(element) {
    element.classList.add("hidden")
}

function show(element) {
    element.classList.remove("hidden")
}

