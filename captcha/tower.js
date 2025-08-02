export class Tower {
    constructor(element, disks = []) {
        this.element = element
        this.disks = disks
    }

    get topDisk() {
        return this.disks[this.disks.length - 1] || null
    }

    isEmpty() {
        return this.disks.length === 0
    }

    canPlace(disk) {
        return this.isEmpty() || this.topDisk.isLargerThan(disk)
    }

    place(disk) {
        this.topDisk?.element.classList.remove("top")
        disk.element.classList.add("top")
        this.disks.push(disk)
        this.element.prepend(disk.element)
    }

    remove() {
        if (this.isEmpty())
            return null
        const disk = this.disks.pop()
        this.element.removeChild(disk.element)
        this.topDisk?.element.classList.add("top")
        return disk
    }

    clear() {
        while (!this.isEmpty()) {
            this.remove()
        }
    }

    equals(otherTower) {
        return this.element === otherTower.element
    }
}

