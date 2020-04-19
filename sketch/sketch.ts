width = 640;
height = 480;

let time = 0;

let rate = 3;

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
    if (this.z > 100) this.dead = true; // Evacuate
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
    //this.red ? fill(250, 10, 10): fill(50);
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
    player.x = map(min(max(0, mouseX), width), 0, width, -180 + 30, 180-30);
    super.update();
  }
}

let player: Player;
let boxes = new Array<Box>();
let floors = new Array<Floor>();
let score = 0;
let font: any;
function setup() {
  createCanvas(640, 480, WEBGL);

  let x = 0;
  let y = 120;
  let z = -40;

  player = new Player(x, y, z);
  for (let i = 0; i < 6; i++) {
    floors.push(new Floor(x, 120 + player.height / 2 + 2, -i * 200));
  }

  ambientLight(50);
  directionalLight(255, 3, 0, 0.1, 0.1, 0);
  font = loadFont(
    '../assets/Exo-Light.otf',
    (e) => console.log('loaded'),
    (e) => console.log(`${e}`)
  );
  textSize(36);
  textFont(font);
}

function areColliding(a: Box, b: Box): boolean {
  return (
    a.minX <= b.maxX && a.maxX >= b.minX && a.minZ <= b.maxZ && a.maxZ >= b.minZ
  );
}
let end: boolean = false;
function draw() {
  background(200, 100, 200);

  stroke(100);
  fill(200, 200, 200);

  floors.forEach((f) => f.update());
  floors.forEach((f) => {
    if (f.z >= 200) {
      f.z = (floors.length - 1) * -200;
    }
  });
  floors.forEach((f) => f.draw());

  boxes.forEach((b) => b.draw());

  player.update();
  player.draw();

  boxes.forEach((b) => b.update());
  boxes.forEach((b) => {
    if (areColliding(b, player)) {
      b.red = true;
      end = true;
    } else {
      b.red = false;
    }
  });
  boxes.forEach((b) => {
    if (b.dead) score++;
  });
  boxes = boxes.filter((b) => b.dead === false);

  stroke(0);
  fill(0);
  textAlign(CENTER, CENTER);
  text(str(score).padStart(5, '0'), width / 3, -200);

  time += 1;
  if (time % Math.floor((1 / rate) * 500) == 0)
    boxes.push(new Enemy(random(-180+30, 180-30), 120, -1000));

  if (time % 30 == 0) rate *= 1.01;
  if (end) {
    text('Game Over', 0, -70);
    noLoop();
  }
}
