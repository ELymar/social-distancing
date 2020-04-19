width = 640;
height = 480;
let rate: number = 3;

class Box {
  x: number;
  y: number;
  z: number;
  width: number = 60;
  height: number = 100;
  depth: number = 40;
  minX: number = this.x - this.width / 2;
  maxX: number = this.x + this.width / 2;
  minY: number = this.y - this.height / 2;
  maxY: number = this.y + this.height / 2;
  minZ: number = this.z - this.depth / 2;
  maxZ: number = this.z + this.depth / 2;
  red: boolean = false;
  dead: boolean = false;
  constructor(x: number, y: number, z: number) {
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
    if (this.red) fill(255, 10, 10);
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
    if (this.z > 100) this.dead = true; // Evacuate
  }
  isCollidingWith(other: Box): boolean {
    return (
      this.minX <= other.maxX &&
      this.maxX >= other.minX &&
      this.minZ <= other.maxZ &&
      this.maxZ >= other.minZ
    );
  }
}

class Floor extends Box {
  constructor(x: number, y: number, z: number) {
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
  constructor(x: number, y: number, z: number) {
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
  constructor(x: number, y: number, z: number) {
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

interface Scene {
  update(): void;
  draw(): void;
}

class GameScene implements Scene {
  player: any; // Main actor
  enemies: Box[]; // Infected passerbys
  floors: Floor[]; // Floor tiles
  score: number; // Score
  end: boolean; // Is this the end?
  time: number; // Current game time
  constructor() {
    this.time = 0;
    this.end = false;
    this.player = new Player(0, 120, -40);

    this.enemies = new Array<Enemy>();
    this.floors = new Array<Floor>();
    for (let i = 0; i < 6; i++) {
      this.floors.push(
        new Floor(0, 120 + this.player.height / 2 + 2, -i * 200)
      );
    }
    this.score = 0;
    ambientLight(50);
    directionalLight(255, 3, 0, 0.1, 0.1, 0);
    textSize(36);
  }
  update(): void {

    this.updateFloor();
    this.updateEnemies();
    this.player.update();

    this.time += 1;
    if (this.time % 30 == 0) rate *= 1.01;
  }
    private updateFloor() {
        this.floors.forEach((f) => f.update());
        this.floors.forEach((f) => {
            if (f.z >= 200)
                f.z = (this.floors.length - 1) * -200 + (f.z - 200);
        });
    }

    private updateEnemies() {
        this.enemies.forEach((b) => b.update());
        this.enemies.forEach((b) => {
            if (this.player.isCollidingWith(b)) {
                this.end = true;
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
    }

  draw(): void {
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
      this.player.red = true; 
      this.player.draw(); 
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
  scenes: Scene[];
  currentScene: Scene;
  constructor() {
    this.scenes = new Array<Scene>();
    this.scenes.push(new GameScene());
    this.currentScene = this.scenes[0];
  }

  draw(): void {
    this.currentScene.draw();
  }
  update() {
    this.currentScene.update();
  }
}

let runner: Runner;

function setup() {
  createCanvas(640, 480, WEBGL);
  const font: any = loadFont(
    '../assets/Exo-Light.otf',
    (e) => console.log('loaded'),
    (e) => console.log(`${e}`)
  );
  textFont(font);
  runner = new Runner();
}

function draw() {
  frameRate(60);
  runner.update();
  runner.draw();
}
