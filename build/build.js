class ColorHelper {
    static getColorVector(c) {
        return createVector(red(c), green(c), blue(c));
    }
    static rainbowColorBase() {
        return [
            color('red'),
            color('orange'),
            color('yellow'),
            color('green'),
            color(38, 58, 150),
            color('indigo'),
            color('violet')
        ];
    }
    static getColorsArray(total, baseColorArray = null) {
        if (baseColorArray == null) {
            baseColorArray = ColorHelper.rainbowColorBase();
        }
        var rainbowColors = baseColorArray.map(x => this.getColorVector(x));
        ;
        let colours = new Array();
        for (var i = 0; i < total; i++) {
            var colorPosition = i / total;
            var scaledColorPosition = colorPosition * (rainbowColors.length - 1);
            var colorIndex = Math.floor(scaledColorPosition);
            var colorPercentage = scaledColorPosition - colorIndex;
            var nameColor = this.getColorByPercentage(rainbowColors[colorIndex], rainbowColors[colorIndex + 1], colorPercentage);
            colours.push(color(nameColor.x, nameColor.y, nameColor.z));
        }
        return colours;
    }
    static getColorByPercentage(firstColor, secondColor, percentage) {
        var firstColorCopy = firstColor.copy();
        var secondColorCopy = secondColor.copy();
        var deltaColor = secondColorCopy.sub(firstColorCopy);
        var scaledDeltaColor = deltaColor.mult(percentage);
        return firstColorCopy.add(scaledDeltaColor);
    }
}
class Shapes {
    static star(x, y, radius1, radius2, npoints) {
        var angle = TWO_PI / npoints;
        var halfAngle = angle / 2.0;
        const points = new Array();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * radius2;
            var sy = y + sin(a) * radius2;
            points.push(createVector(sx, sy));
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            points.push(createVector(sx, sy));
        }
        return points;
    }
}
width = 640;
height = 480;
let rate = 3;
class Box {
    constructor(x, y, z) {
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
    draw() {
        push();
        translate(this.x, this.y, this.z);
        box(this.width, this.height, this.depth);
        pop();
    }
    update() {
        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.height / 2;
        this.maxY = this.y + this.height / 2;
        this.minZ = this.z - this.depth / 2;
        this.maxZ = this.z + this.depth / 2;
        if (this.z > 100)
            this.dead = true;
    }
}
class Floor extends Box {
    constructor(x, y, z) {
        super(x, y, z);
        this.width = 390;
        this.height = 3;
        this.depth = 200;
    }
    update() {
        this.z += rate / 2;
        super.update();
    }
    draw() {
        stroke(20, 67, 123);
        fill(20, 33, 89, 40);
        super.draw();
    }
}
class Enemy extends Box {
    constructor(x, y, z) {
        super(x, y, z);
    }
    update() {
        this.z += rate;
        super.update();
    }
    draw() {
        this.red ? fill(250, 10, 10) : fill(50);
        stroke(200);
        super.draw();
    }
}
class Player extends Box {
    constructor(x, y, z) {
        super(x, y, z);
    }
    draw() {
        fill(200);
        stroke(50);
        super.draw();
    }
    update() {
        this.x = map(min(max(0, mouseX), width), 0, width, -180 + 30, 180 - 30);
        super.update();
    }
}
class GameScene {
    constructor() {
        this.time = 0;
        this.end = false;
        this.player = new Player(0, 120, -40);
        this.enemies = new Array();
        this.floors = new Array();
        for (let i = 0; i < 6; i++) {
            this.floors.push(new Floor(0, 120 + this.player.height / 2 + 2, -i * 200));
        }
        this.score = 0;
        ambientLight(50);
        directionalLight(255, 3, 0, 0.1, 0.1, 0);
        textSize(36);
    }
    update() {
        this.time += 1;
        this.floors.forEach((f) => f.update());
        this.floors.forEach((f) => {
            if (f.z >= 200)
                f.z = (this.floors.length - 1) * -200 + (f.z - 200);
        });
        this.player.update();
        this.enemies.forEach((b) => b.update());
        this.enemies.forEach((b) => {
            if (areColliding(b, this.player)) {
                b.red = true;
                this.end = true;
            }
            else {
                b.red = false;
            }
        });
        this.enemies.forEach((b) => {
            if (b.dead)
                this.score++;
        });
        this.enemies = this.enemies.filter((b) => b.dead === false);
        if (this.time % Math.floor((1 / rate) * 500) == 0) {
            console.log('Pushing enemy');
            this.enemies.push(new Enemy(random(-180 + 30, 180 - 30), 120, -1000));
        }
        if (this.time % 30 == 0)
            rate *= 1.01;
    }
    draw() {
        background(200, 100, 200);
        stroke(100);
        fill(200, 200, 200);
        this.floors.forEach((f) => f.draw());
        this.enemies.forEach((b) => b.draw());
        this.player.draw();
        stroke(0);
        fill(255);
        textAlign(CENTER, CENTER);
        text(str(this.score).padStart(5, '0'), width / 3, -200);
        if (this.end) {
            fill(240);
            stroke(240);
            textSize(42);
            strokeWeight(2);
            text('Game Over', 0, -70);
            noLoop();
        }
    }
}
class Runner {
    constructor() {
        this.scenes = new Array();
        this.scenes.push(new GameScene());
        this.currentScene = this.scenes[0];
    }
    draw() {
        this.currentScene.draw();
    }
    update() {
        this.currentScene.update();
    }
}
let runner;
function setup() {
    createCanvas(640, 480, WEBGL);
    const font = loadFont('../assets/Exo-Light.otf', (e) => console.log('loaded'), (e) => console.log(`${e}`));
    textFont(font);
    runner = new Runner();
}
function areColliding(a, b) {
    return (a.minX <= b.maxX && a.maxX >= b.minX && a.minZ <= b.maxZ && a.maxZ >= b.minZ);
}
function draw() {
    frameRate(60);
    runner.update();
    runner.draw();
}
//# sourceMappingURL=build.js.map