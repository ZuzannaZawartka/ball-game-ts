import Ball from "./Ball";
import SquareList from "./SquareList";

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
        document.getElementById(this.id)!.innerText = this.text
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

    checkSurroundings(position: cordsx) {
        let positions = [
            { x: position.x, y: (position.y + 1) },
            { x: position.x, y: (position.y - 1) },
            { x: (position.x + 1), y: position.y },
            { x: (position.x - 1), y: position.y },
        ]
        let areaAvailable = 0;
        let allBallsInArea = 0;

        positions.forEach(pos => {
            if (pos.x >= 0 && pos.x < SquareList.squareList.length && pos.y >= 0 && pos.y < SquareList.squareList.length) {
                if (SquareList.squareList[pos.x][pos.y].checkIsAvailable() != null) {
                    areaAvailable++;
                    if (SquareList.squareList[pos.x][pos.y].ballHere.length)
                        allBallsInArea++
                }
            }
        }
        );
        if (areaAvailable == allBallsInArea) {
            console.log(areaAvailable)
            console.log(allBallsInArea)
            console.log("NIE MOZNA RUSZYC")
            return false
        }
        return true

    }

    setBall(ball?: Ball) { // popraw
        let obstacleElem = this.checkIsAvailable()
        if (ball != undefined) { //jesli nie podamy argumentu nadpisujemy balla z tablicy
            if (obstacleElem && !this.ballHere.length && !this.isChecked) {
                // this.isBall = true
                this.ballHere = []
                this.ballHere.push(ball)
                obstacleElem.appendChild(ball.create())
                return true
            }
        } else {
            if (this.ballHere.length)
                document.getElementById(`${this.id}`)!.appendChild(this.ballHere[0].element)
        }
        return false

    }

    setAsStartEnd(name: string) {
        let obstacleElem = this.checkIsAvailable()
        if (obstacleElem && !this.isChecked) {
            // if () {
            if (name == "START" && this.checkSurroundings(this.cords) && this.ballHere.length) {
                this.ballHere[0].setSize(40)
                return true
            } else if (name == "END" && !this.ballHere.length)
                return true
            //  }
            return false
        }

        return false
    }


    deleteBall() {
        let obstacleElem = this.checkIsAvailable()
        if (obstacleElem && this.ballHere.length) {
            //  BallList.deleteBall(this.ballHere[0]) // usuniecie kulki


            // let ball = this.ballHere[0]
            this.ballHere[0].setSize(30)
            this.ballHere = []
            document.getElementById(`${this.id}`)!.innerHTML = ""
            // BallList.deleteBall(ball)
            // console.log(BallList.balls)
            return true
        } else
            return false

    }


    setColor(color: string) {
        document.getElementById(`${this.id}`)!.style.backgroundColor = color
    }
}

export default Square