export function createDiskElement(width, height, fill, strokeWidth = 0, stroke = "black") {
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

export class Disk {
    constructor(element, size) {
        this.element = element
        this.size = size
    }

    isLargerThan(otherDisk) {
        return this.size > otherDisk.size
    }
}