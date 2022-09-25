var Square = /** @class */ (function () {
    function Square(theID, theSize, theText) {
        this.checked = false;
        this.id = theID;
        this.size = theSize;
        this.text = theText;
    }
    Square.prototype.create = function () {
        var element = document.createElement("div");
        element.classList.add("punkt");
        element.innerText = (this.text).toString();
        element.setAttribute('style', "width: ".concat(this.size, "px; height: ").concat(this.size, "px; border:1px solid black"));
        return element;
    };
    return Square;
}());
var SquareList = /** @class */ (function () {
    function SquareList(theQuantity, theSizeOfSquare) {
        this.quantity = theQuantity;
        this.sizeOfSquare = theSizeOfSquare;
        this.squareList = [];
        // console.log(this.squareList)
        // let s = new Square(0, 12)
        // this.squareList.push({ x: 2, y: 3, object: s })
        this.makeBoard();
    }
    SquareList.prototype.makeBoard = function () {
        var _a;
        for (var i = 0; i < this.quantity; i++) {
            for (var j = 0; j < this.quantity; j++) {
                var square = new Square(i, this.sizeOfSquare, 0);
                this.squareList.push({ x: j, y: i, object: square });
                (_a = document.getElementById('root')) === null || _a === void 0 ? void 0 : _a.appendChild(square.create());
            }
        }
    };
    // refreshBoard() {
    //     document.getElementById("root")?.innerHTML = ""
    // }
    SquareList.prototype.generateObstacles = function (numberOfObstacle) {
        var x = ["zuzia", "kasia", "asia", "basak"];
        for (var i = 0; i < numberOfObstacle; i++) {
            console.log("TO:");
            console.log(x.find(function (el) { return el == "zuzia"; }));
        }
    };
    return SquareList;
}());
function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}
var x2 = new SquareList(5, 50);
x2.generateObstacles(2);
