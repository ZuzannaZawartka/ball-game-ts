import BallList from "./BallList";
import Square from "./Square";
import SquareList from "./SquareList";
import Game from "./Game";
import { cordsx } from "./interfaces";

class PathFinding {

    first_array: Array<Array<Square>>;
    second_array: Array<Array<Array<cordsx>>>;
    ballList: BallList;
    squareList: SquareList;
    array_length: number;
    //count: number;

    constructor(array: Array<Array<Square>>, array_length: number, ballList: BallList, squareList: SquareList) {
        this.array_length = array_length;
        this.first_array = array; //A
        this.second_array = []; //B
        this.ballList = ballList;
        this.squareList = squareList;

        for (let i = 0; i < 9; i++) {
            this.second_array[i] = []
            for (let j = 0; j < 9; j++) {
                this.second_array[i][j] = []
            }
        }

    }

    arraySearching(numberOfStartEndElements: Square[]) {

        let array = [{ x: numberOfStartEndElements[0].cords.x, y: numberOfStartEndElements[0].cords.y }]; // Element Startowy
        let i = 0;
        while (!array.some(e => e.x == numberOfStartEndElements[1].cords.x && e.y == numberOfStartEndElements[1].cords.y)) {
            if (array.length < 1 && i > 5) // prowizoryczne zabezpieczenie
                break;
            let array2: Array<cordsx> = [];
            array.forEach(element => {
                array2 = array2.concat(this.fill_adjacent_items(element, i));
            });
            array = array2
            i++;
        }
    }


    start(numberOfStartEndElements: Square[]) {

        this.arraySearching(numberOfStartEndElements)

        if (this.changeBallPlace(numberOfStartEndElements) == false)
            return false
        return true

    }

    startHover(numberOfStartEndElements: Square[]) {

        this.arraySearching(numberOfStartEndElements)
        //console.table(this.second_array)


        console.log(this.second_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y])



        if (this.second_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].length >= 1) {
            this.squareList.clearPath()
            this.squareList.colorPath(this.second_array, numberOfStartEndElements)
        }

        this.clear()

    }

    changeBallPlace(numberOfStartEndElements: Square[]) {

        if (this.second_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].length) {

            Game.startEndObject[0].deleteBall()

            let ball = BallList.balls.find(e => e.id == (numberOfStartEndElements[0].cords.x + "_" + numberOfStartEndElements[0].cords.y + "_ball"))

            if (ball) {
                BallList.deleteBall(ball)
                ball.recreate(numberOfStartEndElements[1].cords)
                BallList.addBall(ball.recreate(numberOfStartEndElements[1].cords))

                this.squareList.colorPath(this.second_array, numberOfStartEndElements)

                this.first_array[numberOfStartEndElements[0].cords.x][numberOfStartEndElements[0].cords.y].ballHere = []  // clear array of ball in this place
                this.first_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].ballHere.push(ball) // push ball to other array

                document.getElementById(numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y)!.appendChild(ball.create())

                //HERE WILL BE CHECKIG POINT
                this.squareList.checkBallAround(ball)

                this.clear()
                return true
            }
            return false
        }
        this.clear()
        return false

    }


    fill_adjacent_items(pos: cordsx, count: number) {

        let res: Array<cordsx> = [];
        let arr = [
            { x: pos.x, y: (pos.y + 1) },
            { x: pos.x, y: (pos.y - 1) },
            { x: (pos.x + 1), y: pos.y },
            { x: (pos.x - 1), y: pos.y },
        ]

        arr.forEach(element => {
            if (element.x >= 0 && element.x < this.array_length && element.y >= 0 && element.y < this.array_length) {
                let square_element: Square = this.first_array[element.x][element.y]
                if (square_element.checkIsClickable()) {
                    square_element.setText(count.toString())
                    square_element.isChecked = true;
                    this.second_array[element.x][element.y] = this.second_array[pos.x][pos.y].concat(pos)
                    res.push(square_element.cords)
                }
            }
        });

        return res;
    }


    clear() {
        for (let i = 0; i < 9; i++) {
            this.second_array[i] = []
            for (let j = 0; j < 9; j++) {
                this.second_array[i][j] = []
            }
        }

    }

}

export default PathFinding