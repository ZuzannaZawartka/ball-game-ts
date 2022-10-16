var Ball = /** @class */ (function () {
    function Ball(theID, theSize) {
        this.id = theID;
        this.size = theSize;
        this.color = this.getRandomColor();
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
    return Ball;
}());
var BallList = /** @class */ (function () {
    function BallList(squareList) {
        this.squareList = squareList;
        this.balls = [];
        this.size = 40;
    }
    BallList.prototype.generateBalls = function (numberOfObstacle) {
        var _a, _b;
        for (var i = 0; i < numberOfObstacle; i++) {
            var target_cords = { x: generateRandomInteger(0, this.squareList.squareList.length - 1), y: generateRandomInteger(0, this.squareList.squareList.length - 1) };
            // console.log(target_cords)
            var ball = new Ball(target_cords.x + "_" + target_cords.y, this.size - 10);
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
    BallList.prototype.refreshBalls = function () {
        var _this = this;
        this.balls.forEach(function (element) {
            document.getElementById(element.id).appendChild(element.create());
            _this.squareList.squareList[parseInt((element.id).slice(0, 1))][parseInt((element.id).slice(2, 3))].isBall = true;
        });
    };
    return BallList;
}());
var Square = /** @class */ (function () {
    function Square(theSize, theText, theCordX, theCordY) {
        this.isChecked = false;
        this.isBall = false;
        this.size = theSize;
        this.text = (theText).toString();
        this.cords = { x: theCordX, y: theCordY };
        this.id = (this.cords.x + "_" + this.cords.y).toString();
    }
    Square.prototype.setText = function (text) {
        this.text = text;
        document.getElementById(this.id).innerText = this.text;
        this.isChecked = true;
    };
    Square.prototype.create = function () {
        var element = document.createElement("div");
        // element.id = (this.id).toString()
        element.id = this.id;
        element.classList.add("point");
        element.innerText = (this.text).toString();
        element.setAttribute('style', "width: ".concat(this.size, "px; height: ").concat(this.size, "px; border:1px solid black"));
        return element;
    };
    Square.prototype.checkIsClickable = function () {
        if (!this.isChecked && !this.isBall && this.text != "START")
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
        if (obstacleElem && !this.isBall && !this.isChecked) {
            this.isBall = true;
            this.text = "X";
            obstacleElem.appendChild(ball.create());
            return true;
        }
        return false;
    };
    Square.prototype.setAsStartEnd = function (name) {
        var obstacleElem = this.checkIsAvailable();
        if (obstacleElem && !this.isChecked) {
            // this.text = name
            if (name == "START" && this.isBall) {
                obstacleElem.innerHTML = "";
                obstacleElem.style.backgroundColor = "red";
                return true;
            }
            else if (name == "END" && !this.isBall) {
                obstacleElem.innerHTML = "";
                obstacleElem.style.backgroundColor = "red";
                return true;
            }
            return false;
        }
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
    return SquareList;
}());
function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}
var PathFinding = /** @class */ (function () {
    function PathFinding(array, array_length, ballList) {
        this.array_length = array_length;
        this.first_array = array; //A
        this.second_array = []; //B
        this.ballList = ballList;
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
    PathFinding.prototype.changeBallPlace = function (numberOfStartEndElements) {
        var ball = this.ballList.balls.find(function (e) { return e.id == (numberOfStartEndElements[0].cords.x + "_" + numberOfStartEndElements[0].cords.y); });
        this.ballList.balls[this.ballList.balls.indexOf(ball)].id = numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y;
        this.second_array[numberOfStartEndElements[1].cords.x][numberOfStartEndElements[1].cords.y].forEach(function (element) {
            document.getElementById("".concat(element.x + "_" + element.y)).style.backgroundColor = "green";
        });
        document.getElementById(numberOfStartEndElements[1].cords.x + "_" + numberOfStartEndElements[1].cords.y).appendChild(ball.create());
        this.clear();
    };
    PathFinding.prototype.fill_adjacent_items = function (pos, count) {
        var _this = this;
        console.log("Szkanie");
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
        this.pathFinding = new PathFinding(this.squareListClass.squareList, 9, this.ballList);
        this.startEndObject = [];
        this.addListener();
        this.init();
    }
    Game.prototype.init = function () {
        this.ballList.generateBalls(10);
        console.log(this.ballList.balls);
    };
    Game.prototype.pathFindingStart = function () {
        if (this.startEndObject.length == 2) {
            this.pathFinding.start(this.startEndObject);
            //this.startEndObject = [] //TO BEDZIEMY DOPIERO CZYSCIC PO PATHFINDINGU
        }
    };
    Game.prototype.addListener = function () {
        var _this = this;
        document.addEventListener("click", function (e) {
            console.log(e.target);
            if (e.target.classList.contains('ball') || e.target.classList.contains('point') && _this.startEndObject.length < 2) {
                console.log(e.target);
                //let id = parseInt((e.target as Element).id)
                var target_cords = { x: parseInt((e.target.id).slice(0, 1)), y: parseInt((e.target.id).slice(2, 3)) };
                console.log(target_cords);
                // let target_element = this.squareListClass.elementFinder(this.squareListClass.squareList, target_cords)
                var target_element = _this.squareListClass.elementFinder(_this.squareListClass.squareList, target_cords);
                console.log(target_element);
                if (_this.startEndObject.length < 1) {
                    if (target_element === null || target_element === void 0 ? void 0 : target_element.setAsStartEnd("START"))
                        _this.startEndObject.push(target_element);
                }
                else if (_this.startEndObject.length < 2) {
                    if (target_element === null || target_element === void 0 ? void 0 : target_element.setAsStartEnd("END")) {
                        _this.startEndObject.push(target_element);
                        _this.pathFindingStart();
                    }
                }
                else {
                    _this.refresh();
                }
                console.log(_this.startEndObject);
            }
        });
    };
    Game.prototype.refresh = function () {
        this.squareListClass.makeBoard();
        this.ballList.refreshBalls();
        this.startEndObject = [];
    };
    return Game;
}());
var g = new Game();
