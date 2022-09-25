interface cordsx {
    x: number,
    y: number
}

// interface startEnd {
//     start: number | null,
//     end: number | null;
// }
class Square {
    id: number;
    size: number;
    isChecked: boolean = false;
    isObstacle: boolean = false;
    text: string;
    cords: cordsx;
    constructor(theID: number, theSize: number, theText: number, theCordX: number, theCordY: number) {
        this.id = theID;
        this.size = theSize;
        this.text = (theText).toString();
        this.cords = { x: theCordX, y: theCordY }


    }

    create(): HTMLDivElement {
        let element = document.createElement("div")
        element.id = (this.id).toString()
        element.classList.add("point")
        element.innerText = (this.text).toString()
        element.setAttribute('style', `width: ${this.size}px; height: ${this.size}px; border:1px solid black`);
        return element;
    }

    checkIsAvailable() {
        let element = document.getElementById(this.id.toString())
        if (element != (undefined || null))
            return element
        else
            return null
    }
    setObstacle() {
        let obstacleElem = this.checkIsAvailable()
        if (obstacleElem) {
            this.isObstacle = true
            this.text = "X"
            obstacleElem.innerHTML = this.text
        }
    }

    setAsStartEnd(name: string) {
        let obstacleElem = this.checkIsAvailable()
        if (obstacleElem) {
            if (name == "START") {
                this.text = "START"
            }
            else {
                this.text = "END"
            }
            obstacleElem.style.backgroundColor = "red"
            obstacleElem.innerHTML = this.text

        }

    }
}


class SquareList {

    quantity: number;
    sizeOfSquare: number;
    squareList: Square[]
    startEndObject: Number[]


    constructor(theQuantity: number, theSizeOfSquare: number) {
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
        this.startEndObject = []
        this.squareList = []
        this.makeBoard()
        this.addListener()
    }

    makeBoard() {
        let count = 0;
        for (let i = 0; i < this.quantity; i++) {
            for (let j = 0; j < this.quantity; j++) {
                let square = new Square(count++, this.sizeOfSquare, 0, i, j)
                this.squareList.push(square)
                document.getElementById('root')?.appendChild(square.create())
            }
        }
    }

    addListener() {
        document.addEventListener('click', (e) => {
            if ((e.target as Element).classList.contains('point') && this.startEndObject.length < 2) {
                let id = parseInt((e.target as Element).id)
                if (this.startEndObject.length < 1)
                    this.squareList.find(element => element.id == id)?.setAsStartEnd("START")
                else
                    this.squareList.find(element => element.id == id)?.setAsStartEnd("END")
                this.startEndObject.push(id)
                console.log(this.startEndObject)
            }
        });

    }


    generateObstacles(numberOfObstacle: number) {
        for (let i = 0; i < numberOfObstacle; i++) {
            let x: number = generateRandomInteger(0, 4)
            let y: number = generateRandomInteger(0, 4)

            this.squareList.find(element => element.cords.x == x && element.cords.y == y)?.setObstacle()

            console.log(this.squareList.find(element => element.cords.x == x && element.cords.y == y))

        }
    }

}
function generateRandomInteger(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min + 1))
}

let x2 = new SquareList(5, 50)
x2.generateObstacles(2)

