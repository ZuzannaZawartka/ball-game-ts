interface cordsx {
    x: number,
    y: number
}

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
        if (obstacleElem && !this.isObstacle && !this.isChecked) {
            this.isObstacle = true
            this.text = "X"
            obstacleElem.innerHTML = this.text
            return true
        }
        return false
    }

    setAsStartEnd(name: string) {
        let obstacleElem = this.checkIsAvailable()
        if (obstacleElem && !this.isObstacle && !this.isChecked) {
            if (name == "START" || name == "END") {
                this.text = name
                obstacleElem.style.backgroundColor = "red"
                obstacleElem.innerHTML = this.text
                this.isChecked = true
                return true
            }
            return false
        }
    }
}


class SquareList {

    quantity: number;
    sizeOfSquare: number;
    squareList: Square[][]
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
            this.squareList[i] = []
            for (let j = 0; j < this.quantity; j++) {
                let square = new Square(count++, this.sizeOfSquare, 0, i, j)
                this.squareList[i][j] = square
                document.getElementById('root')?.appendChild(square.create())
            }

        }
        console.log(this.squareList)
    }

    addListener() {
        document.addEventListener('click', (e) => {
            if ((e.target as Element).classList.contains('point') && this.startEndObject.length < 2) {
                let id = parseInt((e.target as Element).id)
                if (this.startEndObject.length < 1) {
                    if (this.elementFinder(this.squareList, id)?.setAsStartEnd("START"))
                        this.startEndObject.push(id)
                }
                else
                    if (this.elementFinder(this.squareList, id)?.setAsStartEnd("END")) {
                        this.startEndObject.push(id)
                    }
                // this.squareList.find(element => element.id == id)?.setAsStartEnd("END")
                console.log(this.startEndObject)
            }
        });

    }

    elementFinder = (arr: Array<any>, target: number) => {
        let element = this.squareList[0][0];
        arr.forEach((row, i) => {
            let elementInRow: Square | null = row.find((element: { id: number; }) => element.id == target)
            if (elementInRow)
                element = elementInRow
        })
        return element;
    }

    generateObstacles(numberOfObstacle: number) {
        for (let i = 0; i < numberOfObstacle; i++) {
            let id: number = generateRandomInteger(0, this.squareList.length * this.squareList[0].length)
            console.log(id)
            let isAvailableObs = this.elementFinder(this.squareList, id)?.setObstacle()
            console.log(isAvailableObs)
            while (!isAvailableObs) {
                id = generateRandomInteger(0, this.squareList.length * this.squareList[0].length)
                console.log(id)
                isAvailableObs = this.elementFinder(this.squareList, id)?.setObstacle()
                console.log("Losowoanie ponowne")
            }
        }
    }

}
function generateRandomInteger(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min + 1))
}


class PathFinding {


    rows: number
    cols: number
    grid: number[][]; // all grid points
    unevaluatedGPoints = []
    evaluatedGPoints = []
    path = []

    constructor(rows: number, cols: number) {
        this.rows = rows
        this.cols = cols
        this.grid = []
    }

    heuristic(positionA: { x: number, y: number }, positionB: { x: number, y: number }) {
        let d1 = Math.abs(positionA.x - positionB.x);
        let d2 = Math.abs(positionA.y - positionB.y);
        return d1 + d2
    }


    pathInit() {
        for (let i = 0; i < this.cols; i++) {
            this.grid[i] = []
            for (let j = 0; j < this.rows; j++) {
                //this.grid[i][j] = new GridPoint(i, j);
            }
        }
    }


    pathFind() {

    }
}


class GridPoint extends PathFinding {

    x: number;
    y: number;
    finalCost: number; //total cost
    toGridPointCost: number; // from start to current grid point
    heuristicCost: number;
    // neighbors: []; //poprawy typy
    parent = undefined; //popraw typy

    constructor(cords: { x: number, y: number }) {
        super(5, 5)
        this.x = cords.x
        this.y = cords.y
        this.finalCost = 0
        this.toGridPointCost = 0
        this.heuristicCost = 0
        //  this.neighbors = any[]
        this.parent = undefined
    }

    updateNeighbors() {
        let i = this.x
        let j = this.y
        if (i < this.cols - 1) {
            // this.neighbors.push(this.grid[i + 1][j]);
        }
        if (i > 0) {
            //  this.neighbors.push(this.grid[i - 1][j]);
        }
        if (j < this.rows - 1) {
            //  this.neighbors.push(this.grid[i][j + 1]);
        }
        if (j > 0) {
            //  this.neighbors.push(grid[i][j - 1]);
        }
    }



}

let x2 = new SquareList(5, 50)
x2.generateObstacles(12)

