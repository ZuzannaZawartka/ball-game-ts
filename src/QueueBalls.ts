import Ball from "./Ball";
/**
 * Class Queue cretae queue of balls 
 * and generate colors of all balls
 */

class QueueBalls {

    /**quantity of balls to create */
    public readonly quantity: number;
    /**array of balls in queue */
    public ballsInQueue: Array<Ball>;
    /**how much colors of balls we want */
    public static quantityColors: number;
    /**avaiable colors of balls */
    public static colors: Array<string>


    constructor(quantity: number) {

        QueueBalls.quantityColors = 7;
        QueueBalls.colors = this.generateColors(16777215)
        this.quantity = quantity;
        this.ballsInQueue = []
        this.generateNewBalls()
    }


    /**
    * Function return random color from array
    * @returns color in hexadecimal
    */
    //@log
    private generateColors(range: number) {
        let array = []
        for (let i = 0; i < QueueBalls.quantityColors; i++) {
            let color = Math.floor(Math.random() * range).toString(16);

            if (array.find(el => el == color) == undefined)
                array.push("#" + color.toString())
        }
        console.log(array)
        return array
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