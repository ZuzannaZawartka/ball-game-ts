// interface startEnd {
//     start: number | null,
//     end: number | null;
// }
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
        if (obstacleElem) {
            this.isObstacle = true;
            this.text = "X";
            obstacleElem.innerHTML = this.text;
        }
    };
    Square.prototype.setAsStartEnd = function (name) {
        var obstacleElem = this.checkIsAvailable();
        if (obstacleElem) {
            if (name == "START") {
                this.text = "START";
            }
            else {
                this.text = "END";
            }
            obstacleElem.style.backgroundColor = "red";
            obstacleElem.innerHTML = this.text;
        }
    };
    return Square;
}());
var SquareList = /** @class */ (function () {
    function SquareList(theQuantity, theSizeOfSquare) {
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
            for (var j = 0; j < this.quantity; j++) {
                var square = new Square(count++, this.sizeOfSquare, 0, i, j);
                this.squareList.push(square);
                (_a = document.getElementById('root')) === null || _a === void 0 ? void 0 : _a.appendChild(square.create());
            }
        }
    };
    SquareList.prototype.addListener = function () {
        var _this = this;
        document.addEventListener('click', function (e) {
            var _a, _b;
            if (e.target.classList.contains('point') && _this.startEndObject.length < 2) {
                var id_1 = parseInt(e.target.id);
                if (_this.startEndObject.length < 1)
                    (_a = _this.squareList.find(function (element) { return element.id == id_1; })) === null || _a === void 0 ? void 0 : _a.setAsStartEnd("START");
                else
                    (_b = _this.squareList.find(function (element) { return element.id == id_1; })) === null || _b === void 0 ? void 0 : _b.setAsStartEnd("END");
                _this.startEndObject.push(id_1);
                console.log(_this.startEndObject);
            }
        });
    };
    SquareList.prototype.generateObstacles = function (numberOfObstacle) {
        var _a;
        var _loop_1 = function (i) {
            var x = generateRandomInteger(0, 4);
            var y = generateRandomInteger(0, 4);
            (_a = this_1.squareList.find(function (element) { return element.cords.x == x && element.cords.y == y; })) === null || _a === void 0 ? void 0 : _a.setObstacle();
            console.log(this_1.squareList.find(function (element) { return element.cords.x == x && element.cords.y == y; }));
        };
        var this_1 = this;
        for (var i = 0; i < numberOfObstacle; i++) {
            _loop_1(i);
        }
    };
    return SquareList;
}());
function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}
var x2 = new SquareList(5, 50);
x2.generateObstacles(2);
