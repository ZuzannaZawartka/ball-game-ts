import Square from "./Square";
import Ball from "./Ball";
import BallList from "./BallList";
import { cordsx } from "./interfaces";
import Game from "./Game";

class SquareList {

    quantity: number;
    sizeOfSquare: number;
    static squareList: Square[][]
    startEndObject: number[]
    coloredPath: Square[]
    isActiveMove: boolean;

    toBeatBall: Array<Set<Ball>>;
    diagonalArray2: Set<Ball>
    horizontalArray: Set<Ball>
    verticalArray: Set<Ball>
    diagonalArray1: Set<Ball>
    concatedArray: Set<Ball>



    constructor(theQuantity: number, theSizeOfSquare: number) {
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
        this.isActiveMove = true;
        this.startEndObject = []
        this.coloredPath = []
        SquareList.squareList = []

        this.horizontalArray = new Set<Ball>;
        this.verticalArray = new Set<Ball>;
        this.diagonalArray1 = new Set<Ball>;
        this.diagonalArray2 = new Set<Ball>;
        this.concatedArray = new Set<Ball>;

        this.toBeatBall =
            [this.horizontalArray,
            this.verticalArray,
            this.diagonalArray1,
            this.diagonalArray2,
            this.concatedArray
            ];

        this.makeBoard()
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
    }

    colorPath(pathArray: Array<Array<Array<cordsx>>>, numberOfStartEndElements: Square[]) {
        this.clearPath()

        pathArray[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].forEach(element => {


            this.coloredPath.push(SquareList.squareList[element.x][element.y])
            SquareList.squareList[element.x][element.y].setColor("wheat")
            // document.getElementById(((element.x + "_" + element.y).toString())).style.backgroundColor = this.color
        });
        this.coloredPath.push(SquareList.squareList[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y])// zaznacz rowniez pole pod kulka
        SquareList.squareList[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].setColor("wheat")
    }

    clearPath() {
        if (this.coloredPath.length)
            this.coloredPath.forEach(square => {
                square.setColor("rgb(42, 42, 42)")
            });
        this.coloredPath = []
    }


    refreshBoard() {

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
                    document.getElementById(`${SquareList.squareList[i][j].id}`)!.appendChild(SquareList.squareList[i][j].ballHere[0].create())
                }

            }
        }
    }

    refreshBoardHover() {

        // document.getElementById('root')!.innerHTML = ""
        for (let i = 0; i < this.quantity; i++) {
            for (let j = 0; j < this.quantity; j++) {
                ////!-! Przeniesc do jakiejs funkcji w square
                SquareList.squareList[i][j].isChecked = false

                if (SquareList.squareList[i][j].ballHere.length > 0) {
                    // BallList.balls.push(SquareList.squareList[i][j].ballHere[0])
                    // document.getElementById(`${SquareList.squareList[i][j].id}`)!.appendChild(SquareList.squareList[i][j].ballHere[0].create())
                } else {
                    SquareList.squareList[i][j].setText("")
                }
                // document.getElementById(`${SquareList.squareList[i][j].id}`).style.backgroundColor = "white"


            }
        }
    }

    pathTimeout() {
        setTimeout(() => {
            this.clearPath()
            this.turnActiveMove(true)
        }, 100)
    }

    turnActiveMove(variable: boolean) {
        this.isActiveMove = variable;
    }

    checkBallAround(ball: Ball) {
        this.clearAndSetFirstElement(ball)
        //this.toBeatBall.clear()

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (!(i == 0 && j == 0) && ball.cords.x + i >= 0 && ball.cords.x + i < SquareList.squareList.length && ball.cords.y + j >= 0 && ball.cords.y + j < SquareList.squareList.length && SquareList.squareList[ball.cords.x + i][ball.cords.y + j].ballHere.length) {
                    if (SquareList.squareList[ball.cords.x + i][ball.cords.y + j].ballHere[0].color == ball.color) {
                        //this.toBeatBall.add(SquareList.squareList[ball.cords.x + i][ball.cords.y + j].ballHere[0])
                        let ballElement = SquareList.squareList[ball.cords.x + i][ball.cords.y + j].ballHere[0]
                        this.checkLine(SquareList.squareList[ball.cords.x + i][ball.cords.y + j], { x: i, y: j })
                        this.addToArrays({ x: i, y: j }, ballElement)
                    }
                }
            }
        }
        console.log("BEAT ARRAY")
        console.log(this.toBeatBall)
        console.log("BEAT horizontalArray")
        console.log(this.horizontalArray)
        console.log("BEAT verticalArray")
        console.log(this.verticalArray)
        console.log("BEAT diagonalArray1")
        console.log(this.diagonalArray1)
        console.log("BEAT diagonalArray2")
        console.log(this.diagonalArray2)

        this.toBeatBall.forEach(array => {
            if (array.size >= 5) {
                array.forEach(ball => {
                    this.concatedArray.add(ball)
                });
            }
        });

        console.log("TO JEST5 ARR")
        console.log(this.concatedArray)

        if (this.concatedArray.size > 2) {
            this.deleteBalls()
            return true
        } else {
            //this.ballList.addBallsFromQueue()
            return true
        }


    }

    checkLine(placeWithBall: Square, cords: cordsx) {
        if (placeWithBall.cords.x + cords.x >= 0 && placeWithBall.cords.x + cords.x < SquareList.squareList.length && placeWithBall.cords.y + cords.y >= 0 && placeWithBall.cords.y + cords.y < SquareList.squareList.length) {
            if (SquareList.squareList[placeWithBall.cords.x + cords.x][placeWithBall.cords.y + cords.y].ballHere.length) {
                if (SquareList.squareList[placeWithBall.cords.x + cords.x][placeWithBall.cords.y + cords.y].ballHere[0].color == placeWithBall.ballHere[0].color) {
                    let ball: Ball = SquareList.squareList[placeWithBall.cords.x + cords.x][placeWithBall.cords.y + cords.y].ballHere[0]
                    //this.toBeatBall.add(ball)
                    console.log("DODAWANIE")
                    this.checkLine(SquareList.squareList[placeWithBall.cords.x + cords.x][placeWithBall.cords.y + cords.y], cords)

                    this.addToArrays(cords, ball)

                }
            }
        }

    }

    addToArrays(cords: cordsx, ball: Ball) {
        if (cords.x == 0) {
            this.horizontalArray.add(ball)
        } else if (cords.y == 0) {
            this.verticalArray.add(ball)
        } else if (cords.x * cords.y < 0) {
            this.diagonalArray1.add(ball)
        } else {
            this.diagonalArray2.add(ball)
        }
    }

    clearAndSetFirstElement(ball: Ball) {

        this.toBeatBall.forEach(array => {
            array.clear()
            array.add(ball)
        });
    }

    deleteBalls() {

        this.concatedArray.forEach(ball => {
            SquareList.squareList[ball.cords.x][ball.cords.y].deleteBall()
            BallList.deleteBall(ball)
            Game.points += 1;

            this.refreshBoard()
        });
        alert("zdobyto :" + Game.points)
        console.log("-------------- PUNKTY :" + Game.points)
    }

}

export default SquareList