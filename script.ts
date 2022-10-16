interface cordsx {
    x: number,
    y: number
}

class Ball {

    id: string;
    size: number;
    color: string;

    constructor(theID: string, theSize: number) {
        this.id = theID;
        this.size = theSize;
        this.color = this.getRandomColor()
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
        return element;
    }

}


class BallList {

    balls: Array<Ball>
    squareList: SquareList
    size: number

    constructor(squareList: SquareList) {
        this.squareList = squareList
        this.balls = []
        this.size = 40;
    }

    generateBalls(numberOfObstacle: number) {
        for (let i = 0; i < numberOfObstacle; i++) {
            let target_cords: cordsx = { x: generateRandomInteger(0, this.squareList.squareList.length - 1), y: generateRandomInteger(0, this.squareList.squareList.length - 1) }
            // console.log(target_cords)
            let ball = new Ball(target_cords.x + "_" + target_cords.y, this.size - 10)
            let isAvailableObs = this.squareList.elementFinder(this.squareList.squareList, target_cords)?.setBall(ball)
            console.log(isAvailableObs)
            while (!isAvailableObs) {
                target_cords = { x: generateRandomInteger(0, this.squareList.squareList.length - 1), y: generateRandomInteger(0, this.squareList.squareList.length - 1) }
                isAvailableObs = this.squareList.elementFinder(this.squareList.squareList, target_cords)?.setBall(ball)
                console.log("Losowoanie ponowne")
            }

            this.balls.push(ball)

        }
    }

    refreshBalls() {
        this.balls.forEach(element => {
            document.getElementById(element.id).appendChild(element.create())
            this.squareList.squareList[parseInt((element.id).slice(0, 1))][parseInt((element.id).slice(2, 3))].isBall = true;
        });
    }

}


class Square {
    id: string;
    size: number;
    isChecked: boolean = false;
    isBall: boolean = false;
    text: string;
    cords: cordsx;

    constructor(theSize: number, theText: number, theCordX: number, theCordY: number) {

        this.size = theSize;
        this.text = (theText).toString();
        this.cords = { x: theCordX, y: theCordY }
        this.id = (this.cords.x + "_" + this.cords.y).toString();

    }

    setText(text: string) {
        this.text = text
        document.getElementById(this.id).innerText = this.text
        this.isChecked = true

    }

    create(): HTMLDivElement {
        let element = document.createElement("div")
        // element.id = (this.id).toString()
        element.id = this.id
        element.classList.add("point")
        element.innerText = (this.text).toString()
        element.setAttribute('style', `width: ${this.size}px; height: ${this.size}px; border:1px solid black`);
        return element;
    }

    checkIsClickable() {
        if (!this.isChecked && !this.isBall && this.text != "START")
            return true
        return false
    }

    checkIsAvailable() {
        //let element = document.getElementById(this.id.toString())
        let element = document.getElementById(this.id)
        if (element != (undefined || null))
            return element
        else
            return null
    }

    setBall(ball: Ball) {
        let obstacleElem = this.checkIsAvailable()
        if (obstacleElem && !this.isBall && !this.isChecked) {
            this.isBall = true
            this.text = "X"
            obstacleElem.appendChild(ball.create())
            return true
        }
        return false
    }

    setAsStartEnd(name: string) {
        let obstacleElem = this.checkIsAvailable()
        if (obstacleElem && !this.isChecked) {

            // this.text = name

            if (name == "START" && this.isBall) {
                obstacleElem!.innerHTML = ""
                obstacleElem.style.backgroundColor = "red"
                return true
            } else if (name == "END" && !this.isBall) {
                obstacleElem!.innerHTML = ""
                obstacleElem.style.backgroundColor = "red"
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
    startEndObject: number[]


    constructor(theQuantity: number, theSizeOfSquare: number) {
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
        this.startEndObject = []
        this.squareList = []
        this.makeBoard()
        // this.addListener()
    }

    elementFinder = (arr: Array<any>, target: cordsx) => {
        if (arr[target.x][target.y] != undefined) {
            return arr[target.x][target.y];
        } else {
            return undefined
        }
    }

    makeBoard() {
        document.getElementById('root')!.innerHTML = ""
        for (let i = 0; i < this.quantity; i++) {
            this.squareList[i] = []
            for (let j = 0; j < this.quantity; j++) {
                let square = new Square(this.sizeOfSquare, 0, i, j)
                this.squareList[i][j] = square
                document.getElementById('root')?.appendChild(square.create())
            }
        }
        // console.log(this.squareList)
    }


}
function generateRandomInteger(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min + 1))
}


class PathFinding {


    first_array: Array<Array<Square>>;
    second_array: Array<Array<Array<cordsx>>>;
    ballList: BallList;
    array_length: number;
    count: number;
    first_time: boolean;

    constructor(array: Array<Array<Square>>, array_length: number, ballList: BallList) {
        this.array_length = array_length;
        this.first_array = array; //A
        this.second_array = []; //B
        this.ballList = ballList;

        for (let i = 0; i < 9; i++) {
            this.second_array[i] = []
            for (let j = 0; j < 9; j++) {
                this.second_array[i][j] = []
            }
        }

    }


    start(numberOfStartEndElements: Square[]) {
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

        this.changeBallPlace(numberOfStartEndElements)


    }

    changeBallPlace(numberOfStartEndElements: Square[]) {
        let ball = this.ballList.balls.find(e => e.id == (numberOfStartEndElements[0].cords.x + "_" + numberOfStartEndElements[0].cords.y))
        this.ballList.balls[this.ballList.balls.indexOf(ball)].id = numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y


        this.second_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].forEach(element => {
            document.getElementById(`${element.x + "_" + element.y}`).style.backgroundColor = "green"
        });

        document.getElementById(numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y).appendChild(ball.create())
        this.clear()

    }

    fill_adjacent_items(pos: cordsx, count: number) {

        console.log("Szkanie")
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


class Game {

    squareListClass: SquareList
    pathFinding: PathFinding
    ballList: BallList
    startEndObject: Square[]

    constructor() {
        this.squareListClass = new SquareList(9, 50)
        this.ballList = new BallList(this.squareListClass)
        this.pathFinding = new PathFinding(this.squareListClass.squareList, 9, this.ballList)
        this.startEndObject = []
        this.addListener()
        this.init()
    }

    init() {
        this.ballList.generateBalls(10)

        console.log(this.ballList.balls)
    }

    pathFindingStart() {
        if (this.startEndObject.length == 2) {
            this.pathFinding.start(this.startEndObject)
            //this.startEndObject = [] //TO BEDZIEMY DOPIERO CZYSCIC PO PATHFINDINGU
        }
    }


    addListener() {
        document.addEventListener("click", (e) => {
            console.log(e.target)
            if ((e.target as Element).classList.contains('ball') || (e.target as Element).classList.contains('point') && this.startEndObject.length < 2) {
                console.log(e.target)
                //let id = parseInt((e.target as Element).id)
                let target_cords: cordsx = { x: parseInt(((e.target as Element).id).slice(0, 1)), y: parseInt(((e.target as Element).id).slice(2, 3)) }
                console.log(target_cords)
                // let target_element = this.squareListClass.elementFinder(this.squareListClass.squareList, target_cords)
                let target_element = this.squareListClass.elementFinder(this.squareListClass.squareList, target_cords)
                console.log(target_element)
                if (this.startEndObject.length < 1) {
                    if (target_element?.setAsStartEnd("START"))
                        this.startEndObject.push(target_element)
                }
                else if (this.startEndObject.length < 2) {
                    if (target_element?.setAsStartEnd("END")) {
                        this.startEndObject.push(target_element)
                        this.pathFindingStart()
                    }
                } else {
                    this.refresh()
                }

                console.log(this.startEndObject)
            }
        });
    }

    refresh() {
        this.squareListClass.makeBoard()
        this.ballList.refreshBalls()
        this.startEndObject = []
    }
}

let g = new Game()

