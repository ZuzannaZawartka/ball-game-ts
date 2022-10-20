interface cordsx {
    x: number,
    y: number
}

class Ball {

    id: string;
    size: number;
    color: string;
    sizes: Array<number>
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
        return element;
    }


    setSize(size: number) {
        document.getElementById(`${this.id}`).style.width = size + "px"
        document.getElementById(`${this.id}`).style.height = size + "px"
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
        //  this.addListener()
    }

    generateBalls(numberOfObstacle: number) {
        for (let i = 0; i < numberOfObstacle; i++) {
            let target_cords: cordsx = { x: generateRandomInteger(0, this.squareList.squareList.length - 1), y: generateRandomInteger(0, this.squareList.squareList.length - 1) }
            // console.log(target_cords)
            let ball = new Ball(this.size - 10, { x: target_cords.x, y: target_cords.y })
            //   this.addListener(ball)
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


}


class Square {
    id: string;
    size: number;
    isChecked: boolean = false;
    text: string;
    cords: cordsx;
    ballHere: Array<Ball>

    constructor(theSize: number, theText: number, theCordX: number, theCordY: number, ballHere?: Array<Ball>) {

        this.size = theSize;
        this.text = (theText).toString();
        this.cords = { x: theCordX, y: theCordY }
        this.id = (this.cords.x + "_" + this.cords.y).toString();
        this.ballHere = ballHere || []

    }

    setText(text: string) {
        this.text = text
        document.getElementById(this.id).innerText = this.text
    }

    create(): HTMLDivElement {
        let element = document.createElement("div")
        // element.id = (this.id).toString()
        element.id = this.id
        element.classList.add("point")
        // element.innerText = (this.text).toString()
        element.setAttribute('style', `width: ${this.size}px; height: ${this.size}px; border:1px solid black`);
        return element;
    }

    checkIsClickable() {
        if (!this.isChecked && !this.ballHere.length) //  if (!this.isChecked && !this.isBall && this.text != "START")
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

    setBall(ball?: Ball) { // popraw
        let obstacleElem = this.checkIsAvailable()
        console.log(ball)
        if (ball != undefined) { //jesli nie podamy argumentu nadpisujemy balla z tablicy

            console.log("HALO PODANO KULKI")
            if (obstacleElem && !this.ballHere.length && !this.isChecked) {
                // this.isBall = true
                this.ballHere = []
                this.ballHere.push(ball)
                obstacleElem.appendChild(ball.create())
                return true
            }
            // obstacleElem.appendChild(ball.create())
        } else {

            if (this.ballHere.length)
                document.getElementById(`${this.id}`).appendChild(this.ballHere[0].element)

        }
        return false

    }

    setAsStartEnd(name: string) {
        let obstacleElem = this.checkIsAvailable()
        console.log("cos " + this.isChecked)
        if (obstacleElem && !this.isChecked) {
            console.log("WCHODZI W IFA")
            // this.text = name

            if (name == "START" && this.ballHere.length) {
                this.ballHere[0].setSize(40)
                //obstacleElem!.innerHTML = ""
                // obstacleElem.style.backgroundColor = "red"
                return true
            } else if (name == "END" && !this.ballHere.length) {

                //obstacleElem!.innerHTML = ""
                //obstacleElem.style.backgroundColor = "red"
                return true
            }
            return false
        } else {
            console.log("NIE - -- WCHODZI W IFA")
        }
    }


    deleteBall() {
        let obstacleElem = this.checkIsAvailable()
        if (obstacleElem && this.ballHere.length) {
            this.ballHere[0].setSize(30)
            this.ballHere = []
            document.getElementById(`${this.id}`).innerHTML = ""
        } else {
            return false
        }
    }


    setColor(color: string) {
        document.getElementById(`${this.id}`).style.backgroundColor = color
    }
}


class SquareList {

    quantity: number;
    sizeOfSquare: number;
    squareList: Square[][]
    startEndObject: number[]
    coloredPath: Square[]
    isActiveMove: boolean;

    constructor(theQuantity: number, theSizeOfSquare: number) {
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
        this.startEndObject = []
        this.squareList = []
        this.coloredPath = []
        this.isActiveMove = true;
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

    colorPath(pathArray: Array<Array<Array<cordsx>>>, numberOfStartEndElements: Square[]) {
        pathArray[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].forEach(element => {
            console.log(element)
            this.coloredPath.push(this.squareList[element.x][element.y])
            this.squareList[element.x][element.y].setColor("green")
            // document.getElementById(((element.x + "_" + element.y).toString())).style.backgroundColor = this.color
        });
    }

    clearPath() {
        if (this.coloredPath.length)
            this.coloredPath.forEach(square => {
                square.setColor("white")
            });
        this.coloredPath = []
    }


    refreshBoard() {
        // document.getElementById('root')!.innerHTML = ""
        for (let i = 0; i < this.quantity; i++) {
            for (let j = 0; j < this.quantity; j++) {
                ////!-! Przeniesc do jakiejs funkcji w square
                this.squareList[i][j].isChecked = false
                this.squareList[i][j].setText("")
                // document.getElementById(`${this.squareList[i][j].id}`).style.backgroundColor = "white"
                if (this.squareList[i][j].ballHere.length > 0) {
                    console.log(this.squareList[i][j].ballHere)
                    document.getElementById(`${this.squareList[i][j].id}`).appendChild(this.squareList[i][j].ballHere[0].create())
                }

            }
        }
        console.log(this.squareList)
        setTimeout(() => {
            this.clearPath()
            this.isActiveMove = true;
        }, 2000)
    }
}
function generateRandomInteger(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min + 1))
}


class PathFinding {


    first_array: Array<Array<Square>>;
    second_array: Array<Array<Array<cordsx>>>;
    ballList: BallList;
    squareList: SquareList;
    array_length: number;
    count: number;
    first_time: boolean;


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

    // showPath(numberOfStartEndElements: Square[]) {
    //     this.second_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].forEach(element => {
    //         console.log(element)
    //         document.getElementById(((element.x + "_" + element.y).toString())).style.backgroundColor = this.color
    //     });
    // }


    changeBallPlace(numberOfStartEndElements: Square[]) {
        let ball = this.ballList.balls.find(e => e.id == (numberOfStartEndElements[0].cords.x + "_" + numberOfStartEndElements[0].cords.y + "_ball"))

        this.ballList.balls[this.ballList.balls.indexOf(ball)].id = numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y + "_ball" //change ball id
        //!!!!!NIE WIEM CZY TO WYZEJ JEST POTRZEBNE


        ball.id = numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y + "_ball"


        // this.showPath(numberOfStartEndElements)

        this.squareList.colorPath(this.second_array, numberOfStartEndElements)

        this.first_array[numberOfStartEndElements[0].cords.x][numberOfStartEndElements[0].cords.y].ballHere = []  // clear array of ball in this place
        this.first_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].ballHere.push(ball) // push ball to other array

        console.log("NUMER ELEMENTU -------")
        console.log(numberOfStartEndElements[1]);
        console.log(this.first_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].ballHere);


        document.getElementById(numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y).appendChild(ball.create())
        this.clear()
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


class Game {

    squareListClass: SquareList
    pathFinding: PathFinding
    ballList: BallList
    startEndObject: Square[]

    constructor() {
        this.squareListClass = new SquareList(9, 50)
        this.ballList = new BallList(this.squareListClass)
        this.pathFinding = new PathFinding(this.squareListClass.squareList, 9, this.ballList, this.squareListClass)
        this.startEndObject = []
        this.addListener()
        this.init()
    }

    init() {
        this.ballList.generateBalls(20)

        console.log(this.ballList.balls)
    }

    pathFindingStart() {
        if (this.startEndObject.length == 2) {
            this.squareListClass.isActiveMove = false;
            this.pathFinding.start(this.startEndObject)
            //this.startEndObject = [] //TO BEDZIEMY DOPIERO CZYSCIC PO PATHFINDINGU
        }
    }


    addListener() {

        document.addEventListener("click", (e) => {

            console.log("RUCH : ")
            console.log(this.squareListClass.isActiveMove)
            if (this.squareListClass.isActiveMove) // sprawdzamy czy nie mamy sciezki na tablicy
                if ((e.target as Element).classList.contains('ball') || (e.target as Element).classList.contains('point') && this.startEndObject.length < 2) {
                    let target_cords: cordsx = { x: parseInt(((e.target as Element).id).slice(0, 1)), y: parseInt(((e.target as Element).id).slice(2, 3)) }
                    let target_element = this.squareListClass.elementFinder(this.squareListClass.squareList, target_cords)

                    if (target_element.ballHere.length) { //Sprawdzamy czy jest w danym miejscy kulka
                        if (this.startEndObject.length < 1) { // jesli nie mamy elementow w tablicy
                            if (target_element?.setAsStartEnd("START")) // jesli element mozemy ustawic jako startowy pushujemy do tablicy
                                this.startEndObject.push(target_element)

                        } else {
                            if (this.startEndObject.length < 2 && target_element?.setAsStartEnd("START")) { // jesli mamy element w tablicy a mozemy wybrany element ustawic jako startowy
                                this.startEndObject[0].ballHere[0].setSize(30)
                                if (this.startEndObject[0].ballHere[0] == target_element.ballHere[0])  // jesli ta sama kulka to odznaczamy wybor
                                    this.startEndObject = [] // zerujemy liste i zmniejszamy kulke
                                else
                                    // ustawiamy poprzednia kulke na mniejsza
                                    this.startEndObject[0] = target_element; // zastepujemy popprzednia nowa
                            }
                        }
                    } else {
                        if (this.startEndObject.length == 1) {
                            if (target_element?.setAsStartEnd("END")) {
                                this.startEndObject.push(target_element)
                                this.startEndObject[0].deleteBall()
                                this.pathFindingStart()
                                this.refresh()
                            }
                        }
                    }
                }
        });
    }

    refresh() {
        //  this.squareListClass.makeBoard()
        this.squareListClass.refreshBoard()

        this.startEndObject = []
    }
}

let g = new Game()

