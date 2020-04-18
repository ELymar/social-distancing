let angle = 0;
let squares = 10;
let colors: p5.Color[];

width = 640
height = 480

function setup() {
    createCanvas(640, 480, WEBGL)
}

function draw() {
    background(100);
  
    noStroke();
    fill(50);
    push();
    translate(map(mouseX, 0, width, -180, 180), 175);
    rotateY(0);
    // rotateY(1.25);
    rotateX(20);
    // rotateX(-0.9);
    box(60, 100, 40);
    pop();
  

  }
  
