import Ball from "./Ball";
/**
 * Class Queue cretae queue of balls 
 */

class QueueBalls {

    /**quantity of balls to create */
    public readonly quantity: number;
    /**array of balls in queue */
    public ballsInQueue: Array<Ball>;

    constructor(quantity: number) {
        this.quantity = quantity;
        this.ballsInQueue = []
        this.generateNewBalls()
    }


    /**
     * function generate new balls to queue
     */
    public generateNewBalls() {
        document.getElementById("left-site-box")!.innerHTML = ""
        this.ballsInQueue = []
        for (let i = 0; i <= this.quantity; i++) {
            let ball = new Ball(30, { x: -1, y: -1 })
            this.ballsInQueue.push(ball)
            let div = document.createElement("div")
            div.classList.add("queue")
            div.appendChild(ball.create())
            document.getElementById("left-site-box")!.appendChild(div)
        }
    }
}

export default QueueBalls