class Square {
    id: number;
    size: number;
    checked: boolean = false;
    text: number;

    constructor(theID: number, theSize: number, theText: number) {
        this.id = theID;
        this.size = theSize;
        this.text = theText;
    }

    create(): HTMLDivElement {
        let element = document.createElement("div")
        element.classList.add("punkt")
        element.innerText = (this.text).toString()
        element.setAttribute('style', `width: ${this.size}px; height: ${this.size}px; border:1px solid black`);
        return element;
    }
}

class SquareList {

    quantity: number;
    sizeOfSquare: number;
    squareList: Array<{
        x: number,
        y: number,
        object: Object
    }
    >;

    constructor(theQuantity: number, theSizeOfSquare: number) {
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
        this.squareList = []
        // console.log(this.squareList)
        // let s = new Square(0, 12)
        // this.squareList.push({ x: 2, y: 3, object: s })
        this.makeBoard()
    }

    makeBoard() {
        for (let i = 0; i < this.quantity; i++) {
            for (let j = 0; j < this.quantity; j++) {
                let square = new Square(i, this.sizeOfSquare, 0)
                this.squareList.push({ x: j, y: i, object: square })
                document.getElementById('root')?.appendChild(square.create())
            }
        }
    }

    // refreshBoard() {
    //     document.getElementById("root")?.innerHTML = ""
    // }

    generateObstacles(numberOfObstacle: number) {
        let x = ["zuzia", "kasia", "asia", "basak"]
        for (let i = 0; i < numberOfObstacle; i++) {
            console.log("TO:")

            console.log(x.find(el => el == "zuzia"))
        }
    }

}
function generateRandomInteger(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min + 1))
}

let x2 = new SquareList(5, 50)
x2.generateObstacles(2)

