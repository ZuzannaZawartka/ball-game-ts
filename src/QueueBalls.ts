import Ball from "./Ball";

class QueueBalls {

    quantity: number;
    ballsInQueue: Array<Ball>;

    constructor(quantity: number) {
        this.quantity = quantity;
        this.ballsInQueue = []
        this.generateNewBalls()
    }


    generateNewBalls() {
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