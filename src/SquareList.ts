import Square from "./Square";
import BallList from "./BallList";

class SquareList {

    quantity: number;
    sizeOfSquare: number;
    static squareList: Square[][]
    startEndObject: number[]
    coloredPath: Square[]
    isActiveMove: boolean;

    constructor(theQuantity: number, theSizeOfSquare: number) {
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
        this.startEndObject = []
        SquareList.squareList = []
        this.coloredPath = []
        this.isActiveMove = true;
        this.makeBoard()
        // this.addListener()
    }

    static elementFinder = (arr: Array<any>, target: cordsx) => {
        if (arr[target.x][target.y] != undefined) {
            return arr[target.x][target.y];
        } else {
            return undefined
        }
    }

    makeBoard() {
        document.getElementById('root')!.innerHTML = ""
        for (let i = 0; i < this.quantity; i++) {
            SquareList.squareList[i] = []
            for (let j = 0; j < this.quantity; j++) {
                let square = new Square(this.sizeOfSquare, 0, i, j)
                SquareList.squareList[i][j] = square
                document.getElementById('root')?.appendChild(square.create())
            }
        }
        // console.log(SquareList.squareList)
    }

    colorPath(pathArray: Array<Array<Array<cordsx>>>, numberOfStartEndElements: Square[]) {
        pathArray[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].forEach(element => {
            this.coloredPath.push(SquareList.squareList[element.x][element.y])
            SquareList.squareList[element.x][element.y].setColor("green")
            // document.getElementById(((element.x + "_" + element.y).toString())).style.backgroundColor = this.color
        });
        this.coloredPath.push(SquareList.squareList[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y])// zaznacz rowniez pole pod kulka
        SquareList.squareList[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].setColor("green")
    }

    clearPath() {
        if (this.coloredPath.length)
            this.coloredPath.forEach(square => {
                square.setColor("white")
            });
        this.coloredPath = []
    }


    refreshBoard() {
        console.log(BallList.balls)
        BallList.balls = []
        // document.getElementById('root')!.innerHTML = ""
        for (let i = 0; i < this.quantity; i++) {
            for (let j = 0; j < this.quantity; j++) {
                ////!-! Przeniesc do jakiejs funkcji w square
                SquareList.squareList[i][j].isChecked = false
                SquareList.squareList[i][j].setText("")
                // document.getElementById(`${SquareList.squareList[i][j].id}`).style.backgroundColor = "white"
                if (SquareList.squareList[i][j].ballHere.length > 0) {
                    BallList.balls.push(SquareList.squareList[i][j].ballHere[0])
                    console.log("REFRESHIG")
                    document.getElementById(`${SquareList.squareList[i][j].id}`)!.appendChild(SquareList.squareList[i][j].ballHere[0].create())
                }

            }
        }
        console.log(BallList.balls)

    }

    pathTimeout() {
        console.log("czekamy")
        setTimeout(() => {
            this.clearPath()
            this.turnActiveMove(true)
        }, 2000)
    }

    turnActiveMove(variable: boolean) {
        this.isActiveMove = variable;
    }
}

export default SquareList