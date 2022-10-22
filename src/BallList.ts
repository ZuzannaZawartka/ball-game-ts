import Ball from "./Ball";
import SquareList from "./SquareList";
import QueueBalls from "./QueueBalls";
import { cordsx } from "./interfaces";
import Game from "./Game";

class BallList {

    public static balls: Array<Ball>
    public queueBalls: QueueBalls
    public squareList: SquareList
    public size: number

    constructor(queueBalls: QueueBalls, squareList: SquareList) {
        this.queueBalls = queueBalls;
        this.squareList = squareList
        BallList.balls = []
        this.size = 40;
    }

    public static deleteBall(ball: Ball) {
        BallList.balls = BallList.balls.filter(element => element != ball)
    }

    public static addBall(ball: Ball) {
        if (BallList.checkDuplicateCords(ball.cords) == undefined)
            BallList.balls.push(ball)
        return false
    }

    public static checkDuplicateCords(cords: cordsx) {
        return BallList.balls.find(ball => ball.cords.x == cords.x && ball.cords.y == cords.y)
    }

    private generateRandomInteger(min: number, max: number) {
        return Math.floor(min + Math.random() * (max - min + 1))
    }

    public generateBalls(numberOfObstacle: number) {
        for (let i = 0; i < numberOfObstacle; i++) {
            let target_cords: cordsx = this.generateCords()

            let ball = new Ball(this.size - 10, { x: target_cords.x, y: target_cords.y })
            let isAvailableObs = SquareList.elementFinder(SquareList.squareList, target_cords)?.setBall(ball)

            while (!isAvailableObs) {
                target_cords = { x: this.generateRandomInteger(0, SquareList.squareList.length - 1), y: this.generateRandomInteger(0, SquareList.squareList.length - 1) }
                isAvailableObs = SquareList.elementFinder(SquareList.squareList, target_cords)?.setBall(ball)
            }
            BallList.balls.push(ball)
        }
    }

    private generateCords() {
        let target_cords: cordsx = { x: this.generateRandomInteger(0, SquareList.squareList.length - 1), y: this.generateRandomInteger(0, SquareList.squareList.length - 1) }
        while (BallList.checkDuplicateCords(target_cords) != undefined) {
            target_cords = { x: this.generateRandomInteger(0, SquareList.squareList.length - 1), y: this.generateRandomInteger(0, SquareList.squareList.length - 1) }
        }
        return target_cords;
    }

    public addBallsFromQueue() {
        if (BallList.balls.length < (SquareList.squareList.length * SquareList.squareList.length - (this.queueBalls.quantity + 1))) {
            this.queueBalls.ballsInQueue.forEach(element => {
                let target_cords: cordsx = this.generateCords()
                let ball = element.recreate(target_cords)
                let isAvailableObs = SquareList.elementFinder(SquareList.squareList, target_cords)?.setBall(ball)

                while (!isAvailableObs) {
                    target_cords = { x: this.generateRandomInteger(0, SquareList.squareList.length - 1), y: this.generateRandomInteger(0, SquareList.squareList.length - 1) }
                    isAvailableObs = SquareList.elementFinder(SquareList.squareList, target_cords)?.setBall(ball)
                }
                BallList.balls.push(ball)

                this.squareList.checkBallAround(ball, false)
            });
            this.queueBalls.generateNewBalls()
        } else {
            Game.turnActiveMove(false)
            console.log(Game.isActiveMove)
            alert("PRZEGRALES")
        }

    }
}

export default BallList