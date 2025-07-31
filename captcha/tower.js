export class Tower {
    constructor(element, disks = []) {
        this.element = element
        this.disks = disks
    }
    
    hasDisk() {
        return this.disks.length > 0 
    }

    getTopDisk() {
        return this.hasDisk() ? this.disks[this.disks.length - 1] : null
    }

    isTopDisk(disk) {
        disk.element = this.getTopDisk()?.element
    }

    canPlace(disk) {
        return !this.hasDisk() || this.getTopDisk().isLargerThan(disk)
    }

    placeDisk(disk) {
        if(this.canPlace(disk)) {
            this.getTopDisk()?.element.classList.remove("top")
            disk.element.classList.add("top")
            this.disks.push(disk)
            this.element.prepend(disk.element)
            return true
        } 
        return false
    }

    removeDisk() {
        if(this.hasDisk()) {
            let topDisk = this.disks.pop()
            this.element.removeChild(topDisk.element)
            this.getTopDisk()?.element.classList.add("top")
            return topDisk
        }
        return null
    }

    removeAllDisks() {
        while(this.hasDisk()) {
            this.removeDisk()
        }
    }

    equals(otherTower) {
        return this.element === otherTower.element
    }
}