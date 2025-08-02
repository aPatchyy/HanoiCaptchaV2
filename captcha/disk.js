export class Disk {
    static MINIMUM_WIDTH = 50   //  Width of smallest disk
    static STEP_SIZE = 10   //  Size added to width of each additional disk
    static HEIGHT = 26  // Disk height or thickness

    //  Disk fill colors determined by rank
    static COLORS = [
        "#FF0000",
        "#FF8000",
        "#FFFF00",
        "#00FF00",
        "#00FFFF",
        "#0000FF",
        "#8000FF",
        "#FF00FF",
    ]

    constructor(rank) {
        this.rank = rank < 0 ? 0 : rank
        const width = Disk.MINIMUM_WIDTH + rank * Disk.STEP_SIZE
        const fill = Disk.COLORS[rank % Disk.COLORS.length]
        this.element = this.#createDiskElement(width, Disk.HEIGHT, fill, 1)
    }

    #createDiskElement(width, height, fill, strokeWidth = 0, stroke = "black") {
        const svgNameSpace = "http://www.w3.org/2000/svg"
        const svg = document.createElementNS(svgNameSpace, "svg")
        svg.setAttribute("width", width)
        svg.setAttribute("height", height)
        svg.setAttribute("overflow", "visible")
        svg.classList.add("disk")
        const rect = document.createElementNS(svgNameSpace, "rect")
        rect.setAttribute("x", 0)
        rect.setAttribute("y", 0)
        rect.setAttribute("width", width)
        rect.setAttribute("height", height)
        rect.setAttribute("fill", fill)
        rect.setAttribute("rx", height / 2)
        rect.setAttribute("ry", height / 2)
        rect.setAttribute("stroke-width", strokeWidth)
        rect.setAttribute("stroke", stroke)
        rect.setAttribute("pointer-events", "none")
        svg.appendChild(rect)
        return svg
    }

    isLargerThan(otherDisk) {
        return this.rank > otherDisk.rank
    }

    equals(otherDisk) {
        return this.element === otherDisk.element &&
            this.rank === otherDisk.rank
    }
}

