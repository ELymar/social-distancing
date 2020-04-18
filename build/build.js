var ColorHelper = (function () {
    function ColorHelper() {
    }
    ColorHelper.getColorVector = function (c) {
        return createVector(red(c), green(c), blue(c));
    };
    ColorHelper.rainbowColorBase = function () {
        return [
            color('red'),
            color('orange'),
            color('yellow'),
            color('green'),
            color(38, 58, 150),
            color('indigo'),
            color('violet')
        ];
    };
    ColorHelper.getColorsArray = function (total, baseColorArray) {
        var _this = this;
        if (baseColorArray === void 0) { baseColorArray = null; }
        if (baseColorArray == null) {
            baseColorArray = ColorHelper.rainbowColorBase();
        }
        var rainbowColors = baseColorArray.map(function (x) { return _this.getColorVector(x); });
        ;
        var colours = new Array();
        for (var i = 0; i < total; i++) {
            var colorPosition = i / total;
            var scaledColorPosition = colorPosition * (rainbowColors.length - 1);
            var colorIndex = Math.floor(scaledColorPosition);
            var colorPercentage = scaledColorPosition - colorIndex;
            var nameColor = this.getColorByPercentage(rainbowColors[colorIndex], rainbowColors[colorIndex + 1], colorPercentage);
            colours.push(color(nameColor.x, nameColor.y, nameColor.z));
        }
        return colours;
    };
    ColorHelper.getColorByPercentage = function (firstColor, secondColor, percentage) {
        var firstColorCopy = firstColor.copy();
        var secondColorCopy = secondColor.copy();
        var deltaColor = secondColorCopy.sub(firstColorCopy);
        var scaledDeltaColor = deltaColor.mult(percentage);
        return firstColorCopy.add(scaledDeltaColor);
    };
    return ColorHelper;
}());
var Shapes = (function () {
    function Shapes() {
    }
    Shapes.star = function (x, y, radius1, radius2, npoints) {
        var angle = TWO_PI / npoints;
        var halfAngle = angle / 2.0;
        var points = new Array();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * radius2;
            var sy = y + sin(a) * radius2;
            points.push(createVector(sx, sy));
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            points.push(createVector(sx, sy));
        }
        return points;
    };
    return Shapes;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
width = 640;
height = 480;
var time = 0;
var rate = 3;
var Box = (function () {
    function Box(x, y, z) {
        this.width = 60;
        this.height = 100;
        this.depth = 40;
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.height / 2;
        this.maxY = this.y + this.height / 2;
        this.minZ = this.z - this.depth / 2;
        this.maxZ = this.z + this.depth / 2;
        this.red = false;
        this.dead = false;
        this.x = x;
        this.y = y;
        this.z = z;
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.height / 2;
        this.maxY = this.y + this.height / 2;
        this.minZ = this.z - this.depth / 2;
        this.maxZ = this.z + this.depth / 2;
    }
    Box.prototype.draw = function () {
        push();
        translate(this.x, this.y, this.z);
        box(this.width, this.height, this.depth);
        pop();
    };
    Box.prototype.update = function () {
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.height / 2;
        this.maxY = this.y + this.height / 2;
        this.minZ = this.z - this.depth / 2;
        this.maxZ = this.z + this.depth / 2;
        if (this.z > 100)
            this.dead = true;
    };
    return Box;
}());
var Floor = (function (_super) {
    __extends(Floor, _super);
    function Floor(x, y, z) {
        var _this = _super.call(this, x, y, z) || this;
        _this.width = 360;
        _this.height = 3;
        _this.depth = 200;
        return _this;
    }
    Floor.prototype.update = function () {
        this.z += rate / 2;
        _super.prototype.update.call(this);
    };
    Floor.prototype.draw = function () {
        stroke(20, 67, 123);
        fill(20, 33, 89, 40);
        _super.prototype.draw.call(this);
    };
    return Floor;
}(Box));
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(x, y, z) {
        return _super.call(this, x, y, z) || this;
    }
    Enemy.prototype.update = function () {
        this.z += rate;
        _super.prototype.update.call(this);
    };
    Enemy.prototype.draw = function () {
        this.red ? fill(250, 10, 10) : fill(50);
        stroke(200);
        _super.prototype.draw.call(this);
    };
    return Enemy;
}(Box));
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(x, y, z) {
        return _super.call(this, x, y, z) || this;
    }
    Player.prototype.draw = function () {
        fill(200);
        stroke(50);
        _super.prototype.draw.call(this);
    };
    Player.prototype.update = function () {
        player.x = map(mouseX, 0, width, -180, 180);
        _super.prototype.update.call(this);
    };
    return Player;
}(Box));
var player;
var boxes = new Array();
var floors = new Array();
var score = 0;
var font;
function setup() {
    createCanvas(640, 480, WEBGL);
    var x = 0;
    var y = 120;
    var z = -40;
    player = new Player(x, y, z);
    for (var i = 0; i < 6; i++) {
        floors.push(new Floor(x, 120 + player.height / 2 + 2, -i * 200));
    }
    ambientLight(50);
    directionalLight(255, 3, 0, 0.1, 0.1, 0);
    font = loadFont('../assets/Exo-Light.otf', function (e) { return console.log('loaded'); }, function (e) { return console.log("" + e); });
    textSize(24);
    textFont(font);
}
function areColliding(a, b) {
    return (a.minX <= b.maxX && a.maxX >= b.minX && a.minZ <= b.maxZ && a.maxZ >= b.minZ);
}
var end = false;
function draw() {
    background(200, 100, 200);
    stroke(100);
    fill(200, 200, 200);
    floors.forEach(function (f) { return f.update(); });
    floors.forEach(function (f) {
        if (f.z >= 200) {
            f.z = (floors.length - 1) * -200;
        }
    });
    floors.forEach(function (f) { return f.draw(); });
    boxes.forEach(function (b) { return b.draw(); });
    player.update();
    player.draw();
    boxes.forEach(function (b) { return b.update(); });
    boxes.forEach(function (b) {
        if (areColliding(b, player)) {
            b.red = true;
            end = true;
        }
        else {
            b.red = false;
        }
    });
    boxes.forEach(function (b) {
        if (b.dead)
            score++;
    });
    boxes = boxes.filter(function (b) { return b.dead === false; });
    stroke(0);
    fill(0);
    textAlign(CENTER, CENTER);
    text(str(score).padStart(5, 0), width / 3, -200);
    time += 1;
    if (time % Math.floor((1 / rate) * 500) == 0)
        boxes.push(new Enemy(random(-180, 180), 120, -1000));
    if (time % 30 == 0)
        rate *= 1.01;
    if (end) {
        text('Game Over', 0, -70);
        image(pg, 0, 0, 640, 480);
        noLoop();
    }
}
//# sourceMappingURL=build.js.map