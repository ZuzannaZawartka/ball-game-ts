import Ball from "./Ball";
import SquareList from "./SquareList";

class BallList {

    static balls: Array<Ball>
    size: number

    constructor() {
        BallList.balls = []
        this.size = 40;
    }

    static deleteBall(ball: Ball) {
        BallList.balls = BallList.balls.filter(element => element != ball)
    }

    static addBall(ball: Ball) {
        if (BallList.checkDuplicateCords(ball.cords) == undefined)
            BallList.balls.push(ball)
        return false
    }

    static checkDuplicateCords(cords: cordsx) {
        return BallList.balls.find(ball => ball.cords.x == cords.x && ball.cords.y == cords.y)
    }
    generateRandomInteger(min: number, max: number) {
        return Math.floor(min + Math.random() * (max - min + 1))
    }

    generateBalls(numberOfObstacle: number) {
        for (let i = 0; i < numberOfObstacle; i++) {
            let target_cords: cordsx = { x: this.generateRandomInteger(0, SquareList.squareList.length - 1), y: this.generateRandomInteger(0, SquareList.squareList.length - 1) }

            while (BallList.checkDuplicateCords(target_cords) != undefined) {
                console.log("Losowanie nowych cordsow")
                target_cords = { x: this.generateRandomInteger(0, SquareList.squareList.length - 1), y: this.generateRandomInteger(0, SquareList.squareList.length - 1) }
            }

            let ball = new Ball(this.size - 10, { x: target_cords.x, y: target_cords.y })
            let isAvailableObs = SquareList.elementFinder(SquareList.squareList, target_cords)?.setBall(ball)

            while (!isAvailableObs) {
                target_cords = { x: this.generateRandomInteger(0, SquareList.squareList.length - 1), y: this.generateRandomInteger(0, SquareList.squareList.length - 1) }
                isAvailableObs = SquareList.elementFinder(SquareList.squareList, target_cords)?.setBall(ball)
                console.log("Losowoanie ponowne")
            }

            BallList.balls.push(ball)
        }

        // console.log(BallList.balls)
    }


}

export default BallList