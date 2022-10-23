import Square from "./Square";
import Ball from "./Ball";
import BallList from "./BallList";
import QueueBalls from "./QueueBalls";
import { cordsx } from "./interfaces";
import Game from "./Game";

class SquareList {

    private quantity: number;
    private sizeOfSquare: number;
    public static squareList: Square[][]
    public static wasBeaten: boolean;
    private coloredPath: Square[]


    private toBeatBall: Array<Set<Ball>>;
    private diagonalArray2: Set<Ball>
    private horizontalArray: Set<Ball>
    private verticalArray: Set<Ball>
    private diagonalArray1: Set<Ball>
    private concatedArray: Set<Ball>



    constructor(theQuantity: number, theSizeOfSquare: number) {
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
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


    /** find element in array */
    public static elementFinder = (arr: Array<any>, target: cordsx) => {
        if (arr[target.x][target.y] != undefined) {
            return arr[target.x][target.y];
        } else {
            return undefined
        }
    }


    /** creating board in html */
    private makeBoard() {
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


    /** color path from array */
    public colorPath(pathArray: Array<Array<Array<cordsx>>>, numberOfStartEndElements: Square[]) {
        this.clearPath()

        pathArray[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].forEach(element => {


            this.coloredPath.push(SquareList.squareList[element.x][element.y])
            SquareList.squareList[element.x][element.y].setColor("wheat")
            // document.getElementById(((element.x + "_" + element.y).toString())).style.backgroundColor = this.color
        });
        this.coloredPath.push(SquareList.squareList[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y])// zaznacz rowniez pole pod kulka
        SquareList.squareList[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].setColor("wheat")
    }


    /** clear colored path */
    public clearPath() {
        if (this.coloredPath.length)
            this.coloredPath.forEach(square => {
                square.setColor("rgb(42, 42, 42)")
            });
        this.coloredPath = []
    }


    /** refresh board after click and properities */
    public refreshBoard() {
        BallList.balls = []
        for (let i = 0; i < this.quantity; i++) {
            for (let j = 0; j < this.quantity; j++) {
                SquareList.squareList[i][j].isChecked = false
                SquareList.squareList[i][j].setText("")
                if (SquareList.squareList[i][j].ballHere.length > 0) {
                    BallList.balls.push(SquareList.squareList[i][j].ballHere[0])
                    document.getElementById(`${SquareList.squareList[i][j].id}`)!.appendChild(SquareList.squareList[i][j].ballHere[0].create())
                }

            }
        }
    }

    /** refresh board after hover */
    public refreshBoardHover() {
        for (let i = 0; i < this.quantity; i++) {
            for (let j = 0; j < this.quantity; j++) {
                SquareList.squareList[i][j].isChecked = false
                if (SquareList.squareList[i][j].ballHere.length > 0) {
                } else {
                    SquareList.squareList[i][j].setText("")
                }
            }
        }
    }

    /** check if you beat ball */
    public checkBallAround(ball: Ball, yourTurn: boolean) {
        this.clearAndSetFirstElement(ball)
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

        this.toBeatBall.forEach(array => {
            if (array.size >= 5) {
                array.forEach(ball => {
                    this.concatedArray.add(ball)
                });
            }
        });

        if (this.concatedArray.size > 2) {
            this.deleteBalls()
            SquareList.wasBeaten = true;
            return true
        } else {
            if (yourTurn == true)
                SquareList.wasBeaten = false;
            else
                SquareList.wasBeaten = true;
            return false
        }


    }

    /** check place and serach ball in next cords */
    private checkLine(placeWithBall: Square, cords: cordsx) {
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

    /** if we have ball next to ball add to specific array */
    private addToArrays(cords: cordsx, ball: Ball) {
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

    /**clear sets and set first element */
    private clearAndSetFirstElement(ball: Ball) {

        this.toBeatBall.forEach(array => {
            array.clear()
            array.add(ball)
        });
    }

    /**delete ball if 5 or more in one line */
    private deleteBalls() {
        let score = 0;
        this.concatedArray.forEach(ball => {
            SquareList.squareList[ball.cords.x][ball.cords.y].deleteBall()
            BallList.deleteBall(ball)
            Game.points += 1;
            score++;
            this.refreshBoard()
        });

        //  Ball.colors.indexOf([...this.concatedArray][0].color) //get index of color ball
        BallList.beatenBalls[QueueBalls.colors.indexOf([...this.concatedArray][0].color)] += score;

        console.log(BallList.beatenBalls)
        document.getElementById("points")!.innerText = (Game.points).toString() // ustawienie punktow na stronie html
        BallList.generateBeatenBallsOnPage()
    }



}

export default SquareList