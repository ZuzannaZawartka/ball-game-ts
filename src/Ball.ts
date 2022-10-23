import { cordsx } from "./interfaces";
import QueueBalls from "./QueueBalls";

/** Ball class */
class Ball {
  /**id ball template (cords.x + "_" + cords.y + "_ball") */
  public id: string;
  /**size in px of html element ball */
  public size: number;
  /**color of ball in html element */
  public color: string;
  /**cords of ball in array */
  public cords: cordsx;
  /**Html element*/
  public element: HTMLDivElement;

  constructor(theSize: number, cords: cordsx) {

    //= ["#8c10eb", "#10ceeb", "#06a144", "#deca16", "#d9840d", "#9c2414", "#95149c"]
    this.id = cords.x + "_" + cords.y + "_ball"
    this.size = theSize;
    this.cords = cords;
    this.color = this.getRandomColor()
    this.element = this.create()
    this.create()
  }


  private getRandomColor() {
    return QueueBalls.colors[Math.floor(Math.random() * (QueueBalls.colors.length - 1))];
  }

  /**
    * Function create html element
    * @returns html element of ball
  */
  public create() {
    let element = document.createElement("div")
    element.id = this.id
    element.classList.add("ball")
    element.setAttribute('style', `width: ${this.size}px; height: ${this.size}px;background-color:${this.color}`);
    this.element = element;
    return element;
  }

  /**
    * Function recreate html element
    * @param cord 
    * @module cordsx
    * @returns object of ball
  */
  public recreate(cords: cordsx) {
    this.id = cords.x + "_" + cords.y + "_ball"
    this.cords = { x: cords.x, y: cords.y }
    this.element = this.create()
    return this
  }

  /**
    * Function set size of html element
    * @param size
  */
  public setSize(size: number) {
    document.getElementById(`${this.id}`)!.style.width = size + "px"
    document.getElementById(`${this.id}`)!.style.height = size + "px"
  }

  /**set ball color from array
   * @param color number of color from array
   */
  public setColor(color: number) {
    this.color = QueueBalls.colors[color]
  }

}

export default Ball