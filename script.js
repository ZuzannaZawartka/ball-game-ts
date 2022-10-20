var Ball = /** @class */ (function () {
    function Ball(theSize, cords) {
        // this.id = theID;
        this.id = cords.x + "_" + cords.y + "_ball";
        this.size = theSize;
        this.cords = cords;
        this.color = this.getRandomColor();
        this.element = this.create();
        this.create();
    }
    Ball.prototype.getRandomColor = function () {
        var colors = ["#8c10eb", "#10ceeb", "#06a144", "#deca16", "#d9840d", "#9c2414", "#95149c"];
        return colors[Math.floor(Math.random() * (colors.length - 1))];
    };
    Ball.prototype.create = function () {
        var element = document.createElement("div");
        element.id = this.id;
        element.classList.add("ball");
        element.setAttribute('style', "width: ".concat(this.size, "px; height: ").concat(this.size, "px; border:1px solid black;background-color:").concat(this.color));
        return element;
    };
    Ball.prototype.setSize = function (size) {
        document.getElementById("".concat(this.id)).style.width = size + "px";
        document.getElementById("".concat(this.id)).style.height = size + "px";
    };
    return Ball;
}());
var BallList = /** @class */ (function () {
    function BallList(squareList) {
        this.squareList = squareList;
        this.balls = [];
        this.size = 40;
        //  this.addListener()
    }
    BallList.prototype.generateBalls = function (numberOfObstacle) {
        var _a, _b;
        for (var i = 0; i < numberOfObstacle; i++) {
            var target_cords = { x: generateRandomInteger(0, this.squareList.squareList.length - 1), y: generateRandomInteger(0, this.squareList.squareList.length - 1) };
            // console.log(target_cords)
            var ball = new Ball(this.size - 10, { x: target_cords.x, y: target_cords.y });
            //   this.addListener(ball)
            var isAvailableObs = (_a = this.squareList.elementFinder(this.squareList.squareList, target_cords)) === null || _a === void 0 ? void 0 : _a.setBall(ball);
            console.log(isAvailableObs);
            while (!isAvailableObs) {
                target_cords = { x: generateRandomInteger(0, this.squareList.squareList.length - 1), y: generateRandomInteger(0, this.squareList.squareList.length - 1) };
                isAvailableObs = (_b = this.squareList.elementFinder(this.squareList.squareList, target_cords)) === null || _b === void 0 ? void 0 : _b.setBall(ball);
                console.log("Losowoanie ponowne");
            }
            this.balls.push(ball);
        }
    };
    return BallList;
}());
var Square = /** @class */ (function () {
    function Square(theSize, theText, theCordX, theCordY, ballHere) {
        this.isChecked = false;
        this.size = theSize;
        this.text = (theText).toString();
        this.cords = { x: theCordX, y: theCordY };
        this.id = (this.cords.x + "_" + this.cords.y).toString();
        this.ballHere = ballHere || [];
    }
    Square.prototype.setText = function (text) {
        this.text = text;
        document.getElementById(this.id).innerText = this.text;
    };
    Square.prototype.create = function () {
        var element = document.createElement("div");
        // element.id = (this.id).toString()
        element.id = this.id;
        element.classList.add("point");
        // element.innerText = (this.text).toString()
        element.setAttribute('style', "width: ".concat(this.size, "px; height: ").concat(this.size, "px; border:1px solid black"));
        return element;
    };
    Square.prototype.checkIsClickable = function () {
        if (!this.isChecked && !this.ballHere.length) //  if (!this.isChecked && !this.isBall && this.text != "START")
            return true;
        return false;
    };
    Square.prototype.checkIsAvailable = function () {
        //let element = document.getElementById(this.id.toString())
        var element = document.getElementById(this.id);
        if (element != (undefined || null))
            return element;
        else
            return null;
    };
    Square.prototype.setBall = function (ball) {
        var obstacleElem = this.checkIsAvailable();
        console.log(ball);
        if (ball != undefined) { //jesli nie podamy argumentu nadpisujemy balla z tablicy
            console.log("HALO PODANO KULKI");
            if (obstacleElem && !this.ballHere.length && !this.isChecked) {
                // this.isBall = true
                this.ballHere = [];
                this.ballHere.push(ball);
                obstacleElem.appendChild(ball.create());
                return true;
            }
            // obstacleElem.appendChild(ball.create())
        }
        else {
            if (this.ballHere.length)
                document.getElementById("".concat(this.id)).appendChild(this.ballHere[0].element);
        }
        return false;
    };
    Square.prototype.setAsStartEnd = function (name) {
        var obstacleElem = this.checkIsAvailable();
        console.log("cos " + this.isChecked);
        if (obstacleElem && !this.isChecked) {
            console.log("WCHODZI W IFA");
            // this.text = name
            if (name == "START" && this.ballHere.length) {
                this.ballHere[0].setSize(40);
                //obstacleElem!.innerHTML = ""
                // obstacleElem.style.backgroundColor = "red"
                return true;
            }
            else if (name == "END" && !this.ballHere.length) {
                //obstacleElem!.innerHTML = ""
                //obstacleElem.style.backgroundColor = "red"
                return true;
            }
            return false;
        }
        else {
            console.log("NIE - -- WCHODZI W IFA");
        }
    };
    Square.prototype.deleteBall = function () {
        var obstacleElem = this.checkIsAvailable();
        if (obstacleElem && this.ballHere.length) {
            this.ballHere[0].setSize(30);
            this.ballHere = [];
            document.getElementById("".concat(this.id)).innerHTML = "";
        }
        else {
            return false;
        }
    };
    Square.prototype.setColor = function (color) {
        document.getElementById("".concat(this.id)).style.backgroundColor = color;
    };
    return Square;
}());
var SquareList = /** @class */ (function () {
    function SquareList(theQuantity, theSizeOfSquare) {
        this.elementFinder = function (arr, target) {
            if (arr[target.x][target.y] != undefined) {
                return arr[target.x][target.y];
            }
            else {
                return undefined;
            }
        };
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
        this.startEndObject = [];
        this.squareList = [];
        this.coloredPath = [];
        this.isActiveMove = true;
        this.makeBoard();
        // this.addListener()
    }
    SquareList.prototype.makeBoard = function () {
        var _a;
        document.getElementById('root').innerHTML = "";
        for (var i = 0; i < this.quantity; i++) {
            this.squareList[i] = [];
            for (var j = 0; j < this.quantity; j++) {
                var square = new Square(this.sizeOfSquare, 0, i, j);
                this.squareList[i][j] = square;
                (_a = document.getElementById('root')) === null || _a === void 0 ? void 0 : _a.appendChild(square.create());
            }
        }
        // console.log(this.squareList)
    };
    SquareList.prototype.colorPath = function (pathArray, numberOfStartEndElements) {
        var _this = this;
        pathArray[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].forEach(function (element) {
            console.log(element);
            _this.coloredPath.push(_this.squareList[element.x][element.y]);
            _this.squareList[element.x][element.y].setColor("green");
            // document.getElementById(((element.x + "_" + element.y).toString())).style.backgroundColor = this.color
        });
    };
    SquareList.prototype.clearPath = function () {
        if (this.coloredPath.length)
            this.coloredPath.forEach(function (square) {
                square.setColor("white");
            });
        this.coloredPath = [];
    };
    SquareList.prototype.refreshBoard = function () {
        var _this = this;
        // document.getElementById('root')!.innerHTML = ""
        for (var i = 0; i < this.quantity; i++) {
            for (var j = 0; j < this.quantity; j++) {
                ////!-! Przeniesc do jakiejs funkcji w square
                this.squareList[i][j].isChecked = false;
                this.squareList[i][j].setText("");
                // document.getElementById(`${this.squareList[i][j].id}`).style.backgroundColor = "white"
                if (this.squareList[i][j].ballHere.length > 0) {
                    console.log(this.squareList[i][j].ballHere);
                    document.getElementById("".concat(this.squareList[i][j].id)).appendChild(this.squareList[i][j].ballHere[0].create());
                }
            }
        }
        console.log(this.squareList);
        setTimeout(function () {
            _this.clearPath();
            _this.isActiveMove = true;
        }, 2000);
    };
    return SquareList;
}());
function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}
var PathFinding = /** @class */ (function () {
    function PathFinding(array, array_length, ballList, squareList) {
        this.array_length = array_length;
        this.first_array = array; //A
        this.second_array = []; //B
        this.ballList = ballList;
        this.squareList = squareList;
        for (var i = 0; i < 9; i++) {
            this.second_array[i] = [];
            for (var j = 0; j < 9; j++) {
                this.second_array[i][j] = [];
            }
        }
    }
    PathFinding.prototype.start = function (numberOfStartEndElements) {
        var _this = this;
        var array = [{ x: numberOfStartEndElements[0].cords.x, y: numberOfStartEndElements[0].cords.y }]; // Element Startowy
        var i = 0;
        var _loop_1 = function () {
            if (array.length < 1 && i > 5) // prowizoryczne zabezpieczenie
                return "break";
            var array2 = [];
            array.forEach(function (element) {
                array2 = array2.concat(_this.fill_adjacent_items(element, i));
            });
            array = array2;
            i++;
        };
        while (!array.some(function (e) { return e.x == numberOfStartEndElements[1].cords.x && e.y == numberOfStartEndElements[1].cords.y; })) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
        this.changeBallPlace(numberOfStartEndElements);
    };
    // showPath(numberOfStartEndElements: Square[]) {
    //     this.second_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].forEach(element => {
    //         console.log(element)
    //         document.getElementById(((element.x + "_" + element.y).toString())).style.backgroundColor = this.color
    //     });
    // }
    PathFinding.prototype.changeBallPlace = function (numberOfStartEndElements) {
        var ball = this.ballList.balls.find(function (e) { return e.id == (numberOfStartEndElements[0].cords.x + "_" + numberOfStartEndElements[0].cords.y + "_ball"); });
        this.ballList.balls[this.ballList.balls.indexOf(ball)].id = numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y + "_ball"; //change ball id
        //!!!!!NIE WIEM CZY TO WYZEJ JEST POTRZEBNE
        ball.id = numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y + "_ball";
        // this.showPath(numberOfStartEndElements)
        this.squareList.colorPath(this.second_array, numberOfStartEndElements);
        this.first_array[numberOfStartEndElements[0].cords.x][numberOfStartEndElements[0].cords.y].ballHere = []; // clear array of ball in this place
        this.first_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].ballHere.push(ball); // push ball to other array
        console.log("NUMER ELEMENTU -------");
        console.log(numberOfStartEndElements[1]);
        console.log(this.first_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].ballHere);
        document.getElementById(numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y).appendChild(ball.create());
        this.clear();
    };
    PathFinding.prototype.fill_adjacent_items = function (pos, count) {
        var _this = this;
        var res = [];
        var arr = [
            { x: pos.x, y: (pos.y + 1) },
            { x: pos.x, y: (pos.y - 1) },
            { x: (pos.x + 1), y: pos.y },
            { x: (pos.x - 1), y: pos.y },
        ];
        arr.forEach(function (element) {
            if (element.x >= 0 && element.x < _this.array_length && element.y >= 0 && element.y < _this.array_length) {
                var square_element = _this.first_array[element.x][element.y];
                if (square_element.checkIsClickable()) {
                    square_element.setText(count.toString());
                    square_element.isChecked = true;
                    _this.second_array[element.x][element.y] = _this.second_array[pos.x][pos.y].concat(pos);
                    res.push(square_element.cords);
                }
            }
        });
        return res;
    };
    PathFinding.prototype.clear = function () {
        for (var i = 0; i < 9; i++) {
            this.second_array[i] = [];
            for (var j = 0; j < 9; j++) {
                this.second_array[i][j] = [];
            }
        }
    };
    return PathFinding;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.squareListClass = new SquareList(9, 50);
        this.ballList = new BallList(this.squareListClass);
        this.pathFinding = new PathFinding(this.squareListClass.squareList, 9, this.ballList, this.squareListClass);
        this.startEndObject = [];
        this.addListener();
        this.init();
    }
    Game.prototype.init = function () {
        this.ballList.generateBalls(20);
        console.log(this.ballList.balls);
    };
    Game.prototype.pathFindingStart = function () {
        if (this.startEndObject.length == 2) {
            this.squareListClass.isActiveMove = false;
            this.pathFinding.start(this.startEndObject);
            //this.startEndObject = [] //TO BEDZIEMY DOPIERO CZYSCIC PO PATHFINDINGU
        }
    };
    Game.prototype.addListener = function () {
        var _this = this;
        document.addEventListener("click", function (e) {
            console.log("RUCH : ");
            console.log(_this.squareListClass.isActiveMove);
            if (_this.squareListClass.isActiveMove) // sprawdzamy czy nie mamy sciezki na tablicy
                if (e.target.classList.contains('ball') || e.target.classList.contains('point') && _this.startEndObject.length < 2) {
                    var target_cords = { x: parseInt((e.target.id).slice(0, 1)), y: parseInt((e.target.id).slice(2, 3)) };
                    var target_element = _this.squareListClass.elementFinder(_this.squareListClass.squareList, target_cords);
                    if (target_element.ballHere.length) { //Sprawdzamy czy jest w danym miejscy kulka
                        if (_this.startEndObject.length < 1) { // jesli nie mamy elementow w tablicy
                            if (target_element === null || target_element === void 0 ? void 0 : target_element.setAsStartEnd("START")) // jesli element mozemy ustawic jako startowy pushujemy do tablicy
                                _this.startEndObject.push(target_element);
                        }
                        else {
                            if (_this.startEndObject.length < 2 && (target_element === null || target_element === void 0 ? void 0 : target_element.setAsStartEnd("START"))) { // jesli mamy element w tablicy a mozemy wybrany element ustawic jako startowy
                                _this.startEndObject[0].ballHere[0].setSize(30);
                                if (_this.startEndObject[0].ballHere[0] == target_element.ballHere[0]) // jesli ta sama kulka to odznaczamy wybor
                                    _this.startEndObject = []; // zerujemy liste i zmniejszamy kulke
                                else
                                    // ustawiamy poprzednia kulke na mniejsza
                                    _this.startEndObject[0] = target_element; // zastepujemy popprzednia nowa
                            }
                        }
                    }
                    else {
                        if (_this.startEndObject.length == 1) {
                            if (target_element === null || target_element === void 0 ? void 0 : target_element.setAsStartEnd("END")) {
                                _this.startEndObject.push(target_element);
                                _this.startEndObject[0].deleteBall();
                                _this.pathFindingStart();
                                _this.refresh();
                            }
                        }
                    }
                }
        });
    };
    Game.prototype.refresh = function () {
        //  this.squareListClass.makeBoard()
        this.squareListClass.refreshBoard();
        this.startEndObject = [];
    };
    return Game;
}());
var g = new Game();
