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

class Scene {
  update(): void {}
  draw(): void {}
  mouseCallback(x: number, y: number): void {}
  setState: (state: GameState) => void;
  constructor(callback: (state: GameState) => void) {
    this.setState = callback;
  }
}

class Button {
  label: string;
  number: any;
  x: number;
  y: number;
  width: number;
  height: number;
  hovered: boolean;
  clickCallback: () => void;
  constructor(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
    clickCallback: () => void
  ) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clickCallback = clickCallback;
    this.hovered = false;
  }

  isMouseOver(): boolean {
    return (
      mouseX >= this.x + width / 2 &&
      mouseX <= this.x + this.width + width / 2 &&
      mouseY >= this.y + height / 2 &&
      mouseY <= this.y + height / 2 + this.height
    );
  }

  handleClick(): void {
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
  player: Player;
  time: number;
  enemy: Enemy;
  buttons: Array<Button>;
  showingAbout: boolean; 
  constructor(callback: (state: GameState) => void) {
    super(callback);
    this.buttons = new Array<Button>();
    this.showingAbout = false; 
    this.buttons.push(
      new Button('Play', -90, 0, 180, 60, () => {
        console.log('Play state');
        this.setState(GameState.PressedPlay);
      })
    );
    this.buttons.push(
      new Button('About', -90, 70, 180, 60, () => {
        this.showingAbout = !this.showingAbout; 
      })
    );
    this.player = new Player(-350, -80, -200);
    this.enemy = new Enemy(350, -80, -200);
    this.time = 0;
  }
  mouseCallback(x: number, y: number): void {
    this.buttons.forEach((b) => b.handleClick());
  }
  update(): void {
    this.player.y = 5 * sin(this.time / 12);
    this.enemy.y = 5 * cos(this.time / 12);
    this.time += 1;
    this.buttons.forEach((b) => b.update());
  }
  draw(): void {
    background(200, 100, 200);
    stroke(100);
    fill(200, 200, 200);
    stroke(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48)
    text('Social Distancing', 0, -120);
    if(this.showingAbout){
      textSize(16);
      text('Avoid others to prevent infection. See how long you can last!', 0, 180)
      text('A game by Eugene Lymar and Kristen Burke', 0, 200)
    }
    this.player.draw();
    this.enemy.draw();
    this.buttons.forEach((b) => b.draw());
  
  }
}

class GameScene extends Scene {
  player: any; // Main actor
  enemies: Box[]; // Infected passerbys
  floors: Floor[]; // Floor tiles
  score: number; // Score
  end: boolean; // Is this the end?
  time: number; // Current game time
  buttons: Array<Button>;

  constructor(callback: (state: GameState) => void) {
    super(callback);
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
    this.buttons = new Array<Button>();
    ambientLight(50);
    directionalLight(255, 3, 0, 0.1, 0.1, 0);
    textSize(36);
  }
  setState: (state: GameState) => void;
  getState(): string {
    return 'Idle';
  }
  mouseCallback(x: number, y: number): void {
    if (this.end) {
      this.buttons.forEach((b) => b.handleClick());
    }
  }
  update(): void {
    if (this.end) {
      this.buttons.forEach((b) => b.update());
      return;
    }
    this.updateFloor();
    this.updateEnemies();

    this.player.update();

    this.time += 1;
    if (this.time % 30 == 0) rate *= 1.01;
  }
  private updateFloor() {
    if (this.end) return;
    this.floors.forEach((f) => f.update());
    this.floors.forEach((f) => {
      if (f.z >= 200) f.z = (this.floors.length - 1) * -200 + (f.z - 200);
    });
  }

  private updateEnemies() {
    if (this.end) return;
    this.enemies.forEach((b) => b.update());
    this.enemies.forEach((b) => {
      if (this.player.isCollidingWith(b)) {
        this.end = true;
        this.setState(GameState.GameOver);
      }
    });
    this.enemies.forEach((b) => {
      if (b.dead) this.score++;
    });
    this.enemies = this.enemies.filter((b) => b.dead === false);
    if (this.time % Math.floor((1 / rate) * 500) == 0) {
      this.enemies.push(new Enemy(random(-180 + 30, 180 - 30), 120, -1000));
    }

    if (this.end && this.buttons.length == 0) {
      this.buttons.push(
        new Button('Restart', -182, -80, 180, 60, () => {
          this.setState(GameState.PressedPlay);
        })
      );
      this.buttons.push(
        new Button('Quit', -2, -80, 180, 60, () => {
          this.setState(GameState.PressedQuit);
        })
      );
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
    this.buttons.forEach((b) => b.draw());
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

enum GameState {
  Intro,
  PressedPlay,
  Round,
  GameOver,
  PressedQuit,
}

class Runner {
  scenes: Scene[];
  currentScene: number;
  state: GameState;
  constructor() {
    this.state = GameState.Intro;
    this.scenes = new Array<Scene>();
    this.scenes.push(
      new IntroScene(this.setState),
      new GameScene(this.setState)
    );
    this.currentScene = 0;
  }

  draw(): void {
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

  setState = (state: GameState) => {
    this.state = state;
  };

  mouseCallback(x: number, y: number) {
    this.scenes[this.currentScene].mouseCallback(x, y);
  }
}

let runner: Runner;

function mousePressed() {
  runner.mouseCallback(mouseX, mouseY);
}

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
