/**
 * The Game, main class which have access to other classes.
 */


import SquareList from "./SquareList"
import BallList from "./BallList"
import Square from "./Square"
import PathFinding from "./PathFinding"
import QueueBalls from "./QueueBalls"
import { cordsx } from "./interfaces";

/**
 * The Game, main class which have access to other classes.
 */
class Game {
    /** access to class SquareList  */
    private squareListClass: SquareList
    /** access to class PathFinding  */
    private pathFinding: PathFinding
    /** access to class BallList  */
    private ballList: BallList
    /** access to class QueueBalls  */
    private queueBalls: QueueBalls
    /** user can't click  */
    public static isActiveMove: boolean;
    /** points in game */
    public static points: number;
    /** array of first and last element out path */
    public static startEndObject: Square[]

    constructor() {
        this.queueBalls = new QueueBalls(6)
        this.squareListClass = new SquareList(9, 50)
        this.ballList = new BallList(this.queueBalls, this.squareListClass)
        this.pathFinding = new PathFinding(SquareList.squareList, 9, this.squareListClass)
        Game.startEndObject = []
        Game.points = 0
        Game.isActiveMove = true;
    }

    /** initial function  */
    public init() {
        this.ballList.generateBalls(3)
        this.addListener()
    }


    private pathFindingStart() {
        if (Game.startEndObject.length == 2) {
            Game.turnActiveMove(false) // block your turn if pathfinding working to show path
            if (this.pathFinding.start(Game.startEndObject) == false) {
                Game.turnActiveMove(true)
                return false
            }
            return true
        }
        return false
    }

    /** function to change state of isActiveMove
     * @param variable boolean which we set in variable isActiveMove
      */
    public static turnActiveMove(variable: boolean) {
        Game.isActiveMove = variable;
    }


    /** function which set Event Listeners */
    private addListener() {
        this.onHover()
        this.onClick()
    }

    private onClick() {
        document.addEventListener("click", (e) => {
            if (Game.isActiveMove == true) // sprawdzamy czy nie mamy sciezki na tablicy
                if ((e.target as Element).classList.contains('ball') || (e.target as Element).classList.contains('point') && Game.startEndObject.length < 2) {
                    let target_cords: cordsx = { x: parseInt(((e.target as Element).id).slice(0, 1)), y: parseInt(((e.target as Element).id).slice(2, 3)) }
                    let target_element = SquareList.elementFinder(SquareList.squareList, target_cords)
                    if (target_element.ballHere.length) { //Sprawdzamy czy jest w danym miejscy kulka
                        this.squareListClass.clearPath()
                        if (Game.startEndObject.length < 1) { // jesli nie mamy elementow w tablicy
                            if (target_element?.setAsStartEnd("START")) // jesli element mozemy ustawic jako startowy pushujemy do tablicy
                                Game.startEndObject.push(target_element)
                        } else {
                            if (Game.startEndObject.length < 2 && target_element?.setAsStartEnd("START")) { // jesli mamy element w tablicy a mozemy wybrany element ustawic jako startowy
                                Game.startEndObject[0].ballHere[0].setSize(30)
                                //this.squareListClass.clearPath()

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
                                    this.refresh()

                                    setTimeout(() => {
                                        this.squareListClass.clearPath()
                                        Game.turnActiveMove(true)
                                        if (!SquareList.wasBeaten)
                                            this.ballList.addBallsFromQueue()
                                    }, 100)

                                } else {
                                    this.squareListClass.clearPath()
                                    this.refresh()
                                }
                            }
                        }
                    }
                }
        });
    }

    private onHover() {
        document.addEventListener("mouseover", (e) => {
            if (Game.isActiveMove == true && Game.startEndObject.length) {
                console.log("MOGE ")
                if ((e.target as Element).classList.contains('point')) {
                    let target_cords: cordsx = { x: parseInt(((e.target as Element).id).slice(0, 1)), y: parseInt(((e.target as Element).id).slice(2, 3)) }
                    let target_element = SquareList.elementFinder(SquareList.squareList, target_cords)
                    if (!target_element.ballHere.length)
                        this.pathFinding.startHover([Game.startEndObject[0], target_element])
                    this.squareListClass.refreshBoardHover()
                }
            }
        })
    }

    private refresh() {
        this.squareListClass.refreshBoard()
        Game.startEndObject = []
    }
}

let g = new Game()
g.init()
export default Game