import SquareList from "./SquareList"
import BallList from "./BallList"
import Square from "./Square"
import PathFinding from "./PathFinding"

class Game {

    squareListClass: SquareList
    pathFinding: PathFinding
    ballList: BallList
    static startEndObject: Square[]

    constructor() {
        this.ballList = new BallList()
        this.squareListClass = new SquareList(9, 50)
        this.pathFinding = new PathFinding(SquareList.squareList, 9, this.ballList, this.squareListClass)
        Game.startEndObject = []
        this.addListener()
        this.init()
    }

    init() {
        this.ballList.generateBalls(20)
    }

    pathFindingStart() {
        if (Game.startEndObject.length == 2) {
            this.squareListClass.turnActiveMove(false) // block your turn if pathfinding working to show path
            if (this.pathFinding.start(Game.startEndObject) == false) {
                this.squareListClass.turnActiveMove(true)
                return false
            }
            return true
        }
        return false
    }




    addListener() {

        document.addEventListener("click", (e) => {
            if (this.squareListClass.isActiveMove) // sprawdzamy czy nie mamy sciezki na tablicy
                if ((e.target as Element).classList.contains('ball') || (e.target as Element).classList.contains('point') && Game.startEndObject.length < 2) {
                    let target_cords: cordsx = { x: parseInt(((e.target as Element).id).slice(0, 1)), y: parseInt(((e.target as Element).id).slice(2, 3)) }
                    let target_element = SquareList.elementFinder(SquareList.squareList, target_cords)

                    console.log(target_element)

                    if (target_element.ballHere.length) { //Sprawdzamy czy jest w danym miejscy kulka
                        if (Game.startEndObject.length < 1) { // jesli nie mamy elementow w tablicy
                            if (target_element?.setAsStartEnd("START")) // jesli element mozemy ustawic jako startowy pushujemy do tablicy
                                Game.startEndObject.push(target_element)

                        } else {
                            if (Game.startEndObject.length < 2 && target_element?.setAsStartEnd("START")) { // jesli mamy element w tablicy a mozemy wybrany element ustawic jako startowy
                                Game.startEndObject[0].ballHere[0].setSize(30)
                                if (Game.startEndObject[0].ballHere[0] == target_element.ballHere[0])  // jesli ta sama kulka to odznaczamy wybor
                                    Game.startEndObject = [] // zerujemy liste i zmniejszamy kulke
                                else
                                    // ustawiamy poprzednia kulke na mniejsza
                                    Game.startEndObject[0] = target_element; // zastepujemy popprzednia nowa
                            } else {
                                Game.startEndObject[0].ballHere[0].setSize(30)
                                Game.startEndObject = []
                            }
                        }
                    } else {
                        if (Game.startEndObject.length == 1) { // Rozpatrz przypadki gdzie mamy poprawny poczatek i koniec ale nie mamy sciezki
                            if (target_element?.setAsStartEnd("END")) {
                                Game.startEndObject.push(target_element)

                                if (this.pathFindingStart() != false) {
                                    console.log("ZNALEZIONO")
                                    this.refresh()
                                    this.squareListClass.pathTimeout()
                                } else {
                                    console.log("NIE ZNALEZIONOW")
                                    this.refresh()
                                }
                            }
                        }
                    }
                }
        });
    }

    refresh() {
        this.squareListClass.refreshBoard()
        Game.startEndObject = []
    }
}

let g = new Game()

export default Game