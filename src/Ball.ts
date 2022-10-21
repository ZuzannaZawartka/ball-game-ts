class Ball {

    id: string;
    size: number;
    color: string;
    cords: cordsx;
    element: HTMLDivElement;

    constructor(theSize: number, cords: cordsx) {
        // this.id = theID;
        this.id = cords.x + "_" + cords.y + "_ball"
        this.size = theSize;
        this.cords = cords;
        this.color = this.getRandomColor()
        this.element = this.create()
        this.create()
    }


    getRandomColor() {
        let colors = ["#8c10eb", "#10ceeb", "#06a144", "#deca16", "#d9840d", "#9c2414", "#95149c"]
        return colors[Math.floor(Math.random() * (colors.length - 1))];
    }

    create() {
        let element = document.createElement("div")
        element.id = this.id
        element.classList.add("ball")
        element.setAttribute('style', `width: ${this.size}px; height: ${this.size}px; border:1px solid black;background-color:${this.color}`);
        this.element = element;
        return element;
    }

    recreate(cords: cordsx) {
        this.id = cords.x + "_" + cords.y + "_ball"
        this.cords = { x: cords.x, y: cords.y }
        this.element = this.create()
        return this
    }

    setSize(size: number) {
        document.getElementById(`${this.id}`)!.style.width = size + "px"
        document.getElementById(`${this.id}`)!.style.height = size + "px"
    }

}

export default Ball