var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Square = /** @class */ (function () {
    function Square(theID, theSize, theText, theCordX, theCordY) {
        this.isChecked = false;
        this.isObstacle = false;
        this.id = theID;
        this.size = theSize;
        this.text = (theText).toString();
        this.cords = { x: theCordX, y: theCordY };
    }
    Square.prototype.create = function () {
        var element = document.createElement("div");
        element.id = (this.id).toString();
        element.classList.add("point");
        element.innerText = (this.text).toString();
        element.setAttribute('style', "width: ".concat(this.size, "px; height: ").concat(this.size, "px; border:1px solid black"));
        return element;
    };
    Square.prototype.checkIsAvailable = function () {
        var element = document.getElementById(this.id.toString());
        if (element != (undefined || null))
            return element;
        else
            return null;
    };
    Square.prototype.setObstacle = function () {
        var obstacleElem = this.checkIsAvailable();
        if (obstacleElem && !this.isObstacle && !this.isChecked) {
            this.isObstacle = true;
            this.text = "X";
            obstacleElem.innerHTML = this.text;
            return true;
        }
        return false;
    };
    Square.prototype.setAsStartEnd = function (name) {
        var obstacleElem = this.checkIsAvailable();
        if (obstacleElem && !this.isObstacle && !this.isChecked) {
            if (name == "START" || name == "END") {
                this.text = name;
                obstacleElem.style.backgroundColor = "red";
                obstacleElem.innerHTML = this.text;
                this.isChecked = true;
                return true;
            }
            return false;
        }
    };
    return Square;
}());
var SquareList = /** @class */ (function () {
    function SquareList(theQuantity, theSizeOfSquare) {
        var _this = this;
        this.elementFinder = function (arr, target) {
            var element = _this.squareList[0][0];
            arr.forEach(function (row, i) {
                var elementInRow = row.find(function (element) { return element.id == target; });
                if (elementInRow)
                    element = elementInRow;
            });
            return element;
        };
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
        this.startEndObject = [];
        this.squareList = [];
        this.makeBoard();
        this.addListener();
    }
    SquareList.prototype.makeBoard = function () {
        var _a;
        var count = 0;
        for (var i = 0; i < this.quantity; i++) {
            this.squareList[i] = [];
            for (var j = 0; j < this.quantity; j++) {
                var square = new Square(count++, this.sizeOfSquare, 0, i, j);
                this.squareList[i][j] = square;
                (_a = document.getElementById('root')) === null || _a === void 0 ? void 0 : _a.appendChild(square.create());
            }
        }
        console.log(this.squareList);
    };
    SquareList.prototype.addListener = function () {
        var _this = this;
        document.addEventListener('click', function (e) {
            var _a, _b;
            if (e.target.classList.contains('point') && _this.startEndObject.length < 2) {
                var id = parseInt(e.target.id);
                if (_this.startEndObject.length < 1) {
                    if ((_a = _this.elementFinder(_this.squareList, id)) === null || _a === void 0 ? void 0 : _a.setAsStartEnd("START"))
                        _this.startEndObject.push(id);
                }
                else if ((_b = _this.elementFinder(_this.squareList, id)) === null || _b === void 0 ? void 0 : _b.setAsStartEnd("END")) {
                    _this.startEndObject.push(id);
                }
                // this.squareList.find(element => element.id == id)?.setAsStartEnd("END")
                console.log(_this.startEndObject);
            }
        });
    };
    SquareList.prototype.generateObstacles = function (numberOfObstacle) {
        var _a, _b;
        for (var i = 0; i < numberOfObstacle; i++) {
            var id = generateRandomInteger(0, this.squareList.length * this.squareList[0].length);
            console.log(id);
            var isAvailableObs = (_a = this.elementFinder(this.squareList, id)) === null || _a === void 0 ? void 0 : _a.setObstacle();
            console.log(isAvailableObs);
            while (!isAvailableObs) {
                id = generateRandomInteger(0, this.squareList.length * this.squareList[0].length);
                console.log(id);
                isAvailableObs = (_b = this.elementFinder(this.squareList, id)) === null || _b === void 0 ? void 0 : _b.setObstacle();
                console.log("Losowoanie ponowne");
            }
        }
    };
    return SquareList;
}());
function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}
var PathFinding = /** @class */ (function () {
    function PathFinding(rows, cols) {
        this.unevaluatedGPoints = [];
        this.evaluatedGPoints = [];
        this.path = [];
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
    }
    PathFinding.prototype.heuristic = function (positionA, positionB) {
        var d1 = Math.abs(positionA.x - positionB.x);
        var d2 = Math.abs(positionA.y - positionB.y);
        return d1 + d2;
    };
    PathFinding.prototype.pathInit = function () {
        for (var i = 0; i < this.cols; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.rows; j++) {
                this.grid[i][j] = new GridPoint(i, j);
            }
        }
    };
    PathFinding.prototype.pathFind = function () {
    };
    return PathFinding;
}());
var GridPoint = /** @class */ (function (_super) {
    __extends(GridPoint, _super);
    function GridPoint(cords) {
        var _this = _super.call(this, 5, 5) || this;
        _this.parent = undefined; //popraw typy
        _this.x = cords.x;
        _this.y = cords.y;
        _this.finalCost = 0;
        _this.toGridPointCost = 0;
        _this.heuristicCost = 0;
        _this.neighbors = any[];
        _this.parent = undefined;
        return _this;
    }
    GridPoint.prototype.updateNeighbors = function () {
        var i = this.x;
        var j = this.y;
        if (i < this.cols - 1) {
            this.neighbors.push(this.grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(this.grid[i - 1][j]);
        }
        if (j < this.rows - 1) {
            this.neighbors.push(this.grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
    };
    return GridPoint;
}(PathFinding));
var x2 = new SquareList(5, 50);
x2.generateObstacles(12);
