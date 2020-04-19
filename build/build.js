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
        this.red = false;
    }
    draw() {
        push();
        translate(this.x, this.y, this.z);
        if (this.red)
            fill(255, 10, 10);
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
    isCollidingWith(other) {
        return (this.minX <= other.maxX &&
            this.maxX >= other.minX &&
            this.minZ <= other.maxZ &&
            this.maxZ >= other.minZ);
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
class Scene {
    constructor(callback) {
        this.setState = callback;
    }
    update() { }
    draw() { }
    mouseCallback(x, y) { }
}
class Button {
    constructor(label, x, y, width, height, clickCallback) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.clickCallback = clickCallback;
        this.hovered = false;
    }
    isMouseOver() {
        return (mouseX >= this.x + width / 2 &&
            mouseX <= this.x + this.width + width / 2 &&
            mouseY >= this.y + height / 2 &&
            mouseY <= this.y + height / 2 + this.height);
    }
    handleClick() {
        if (this.hovered) {
            this.clickCallback();
        }
    }
    update() {
        this.hovered = this.isMouseOver();
    }
    draw() {
        this.hovered ? fill(250, 250, 10) : fill(255);
        this.hovered ? stroke(250, 250, 10) : stroke(255);
        textSize(36);
        text(this.label, this.x + this.width / 2, this.y + this.height / 2.5);
        noFill();
        rect(this.x, this.y, this.width, this.height);
    }
}
class IntroScene extends Scene {
    constructor(callback) {
        super(callback);
        this.buttons = new Array();
        this.buttons.push(new Button('Play', -90, 0, 180, 60, () => {
            console.log("Play state");
            this.setState(GameState.PressedPlay);
        }));
        this.player = new Player(-350, -80, -200);
        this.enemy = new Enemy(350, -80, -200);
        this.time = 0;
    }
    mouseCallback(x, y) {
        this.buttons.forEach((b) => b.handleClick());
    }
    update() {
        this.player.y = 5 * sin(this.time / 12);
        this.enemy.y = 5 * cos(this.time / 12);
        this.time += 1;
        this.buttons.forEach((b) => b.update());
    }
    draw() {
        background(200, 100, 200);
        stroke(100);
        fill(200, 200, 200);
        stroke(0);
        fill(255);
        textAlign(CENTER, CENTER);
        text('Social Distancing', 0, -100);
        this.player.draw();
        this.enemy.draw();
        this.buttons.forEach((b) => b.draw());
    }
}
class GameScene extends Scene {
    constructor(callback) {
        super(callback);
        this.time = 0;
        this.end = false;
        this.player = new Player(0, 120, -40);
        this.enemies = new Array();
        this.floors = new Array();
        for (let i = 0; i < 6; i++) {
            this.floors.push(new Floor(0, 120 + this.player.height / 2 + 2, -i * 200));
        }
        this.score = 0;
        this.buttons = new Array();
        ambientLight(50);
        directionalLight(255, 3, 0, 0.1, 0.1, 0);
        textSize(36);
    }
    getState() {
        return 'Idle';
    }
    mouseCallback(x, y) {
        if (this.end) {
            this.buttons.forEach(b => b.handleClick());
        }
    }
    update() {
        if (this.end) {
            this.buttons.forEach(b => b.update());
            return;
        }
        this.updateFloor();
        this.updateEnemies();
        this.player.update();
        this.time += 1;
        if (this.time % 30 == 0)
            rate *= 1.01;
    }
    updateFloor() {
        if (this.end)
            return;
        this.floors.forEach((f) => f.update());
        this.floors.forEach((f) => {
            if (f.z >= 200)
                f.z = (this.floors.length - 1) * -200 + (f.z - 200);
        });
    }
    updateEnemies() {
        if (this.end)
            return;
        this.enemies.forEach((b) => b.update());
        this.enemies.forEach((b) => {
            if (this.player.isCollidingWith(b)) {
                this.end = true;
                this.setState(GameState.GameOver);
            }
        });
        this.enemies.forEach((b) => {
            if (b.dead)
                this.score++;
        });
        this.enemies = this.enemies.filter((b) => b.dead === false);
        if (this.time % Math.floor((1 / rate) * 500) == 0) {
            this.enemies.push(new Enemy(random(-180 + 30, 180 - 30), 120, -1000));
        }
        if (this.end && this.buttons.length == 0) {
            this.buttons.push(new Button('Restart', -182, -80, 180, 60, () => {
                this.setState(GameState.PressedPlay);
            }));
            this.buttons.push(new Button('Quit', -2, -80, 180, 60, () => {
                this.setState(GameState.PressedQuit);
            }));
        }
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
        this.buttons.forEach(b => b.draw());
        if (this.end) {
            this.player.red = true;
            this.player.draw();
            fill(240);
            stroke(240);
            textSize(42);
            text('Game Over', 0, -120);
        }
    }
}
var GameState;
(function (GameState) {
    GameState[GameState["Intro"] = 0] = "Intro";
    GameState[GameState["PressedPlay"] = 1] = "PressedPlay";
    GameState[GameState["Round"] = 2] = "Round";
    GameState[GameState["GameOver"] = 3] = "GameOver";
    GameState[GameState["PressedQuit"] = 4] = "PressedQuit";
})(GameState || (GameState = {}));
class Runner {
    constructor() {
        this.setState = (state) => {
            this.state = state;
        };
        this.state = GameState.Intro;
        this.scenes = new Array();
        this.scenes.push(new IntroScene(this.setState), new GameScene(this.setState));
        this.currentScene = 0;
    }
    draw() {
        this.scenes[this.currentScene].draw();
    }
    update() {
        this.scenes[this.currentScene].update();
        this.handleTransitions();
    }
    handleTransitions() {
        switch (this.state) {
            case GameState.Intro:
                this.currentScene = 0;
                break;
            case GameState.PressedPlay:
                this.scenes[1] = new GameScene(this.setState);
                rate = 3;
                this.state = GameState.Round;
                break;
            case GameState.Round:
                this.currentScene = 1;
                break;
            case GameState.GameOver:
                this.currentScene = 1;
                break;
            case GameState.PressedQuit:
                this.currentScene = 0;
                break;
        }
    }
    mouseCallback(x, y) {
        this.scenes[this.currentScene].mouseCallback(x, y);
    }
}
let runner;
function mousePressed() {
    runner.mouseCallback(mouseX, mouseY);
}
function setup() {
    createCanvas(640, 480, WEBGL);
    const font = loadFont('../assets/Exo-Light.otf', (e) => console.log('loaded'), (e) => console.log(`${e}`));
    textFont(font);
    runner = new Runner();
}
function draw() {
    frameRate(60);
    runner.update();
    runner.draw();
}
//# sourceMappingURL=build.js.map