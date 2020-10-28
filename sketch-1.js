function getMouseInput() {
  const dx = mouseX - windowWidth/2;
  const dy = mouseY - windowHeight/2;
  const desiredHeading = Math.atan2(dy, dx);
  const goFast = mouseIsPressed;
  return { desiredHeading, goFast };
}

function draw(){
  clear();
  background(0); // black
  stroke(255);  // white
  noFill();

  push();
  const center = getWormPosition();
  console.log(center.x, center.y)
  translate(windowWidth/2 - center.x, windowHeight/2 - center.y);
  drawWorm();
  
  pop();
  fill(255)
  
  const input = getMouseInput();
  const worm = updateWorm(input);
  
  
}

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight);

  // startGame();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function differenceBetweenAngles(firstAngle, secondAngle) {
  var difference = secondAngle - firstAngle;
  while (difference < -Math.PI) difference += 2 * Math.PI;
  while (difference > Math.PI) difference -= 2 * Math.PI;
  return difference;
}

function limitRange(number, limit) {
  if (number > limit) {
    return limit;
  } else if (number < -limit) {
    return -limit;
  }
  return number;
}


function sizeFromLength(length) {
  return 1.5 * Math.pow(length, 0.6);
}

const INITIAL_WORM_LENGTH = 20;
const INITIAL_WORM_SIZE = sizeFromLength(INITIAL_WORM_LENGTH);

const worm = {
  x: 0.0,
  y: 0.0,
  heading: 0.0,
  length: INITIAL_WORM_LENGTH,
  size: INITIAL_WORM_SIZE,
  parts: []
}

function drawWorm() {
  push();
  translate(worm.x, worm.y);
  rotate(worm.heading);
  ellipse(0, 0, worm.size);
  pop();

  worm.parts.forEach((part) => {
    push();
    translate(part.x, part.y);
    ellipse(0, 0, worm.size);
    pop();
  });
}

const MAX_HEADING_CHANGE_FACTOR = 0.5;

const DRAW_SEGMENT_RATE = 7;
var lastDrawn = DRAW_SEGMENT_RATE;

const DROP_RATE = 4;
var lastDrop = DROP_RATE;

const REGULAR_SPEED = 1.0;
const FAST_SPEED = 2.0;

function updateWorm({ desiredHeading, goFast }) {
  // from check input
  const delta = differenceBetweenAngles(worm.heading, desiredHeading);
  const maxHeadingChange = MAX_HEADING_CHANGE_FACTOR / worm.size;
  const limitedDelta = limitRange(delta, maxHeadingChange);
  worm.heading += limitedDelta;

  const isFast = goFast && worm.length > 10;
  const speed = isFast ? FAST_SPEED : REGULAR_SPEED;
  worm.x += Math.cos(worm.heading) * speed;
  // console.log(mouseX, mouseY)
  // console.log(worm.x, worm.y)
  worm.y += Math.sin(worm.heading) * speed;
  if (lastDrawn <= 0) {
    worm.parts.push({x: worm.x, y: worm.y});
    lastDrawn = DRAW_SEGMENT_RATE;
  } else {
    lastDrawn -= speed + 0;
  }
  if (worm.parts.length > worm.length) {
    const last = worm.parts.shift();
    // if (isFast) {
    //   if (lastDrop <= 0) {
    //     food.push(last);
    //     worm.length -= 2.0;
    //     lastDrop = DROP_RATE;
    //   } else {
    //     lastDrop--;
    //   }
    // }
  }
  worm.size = sizeFromLength(worm.length);
  return worm;
}

function growWorm(foodEaten) {
  worm.length += foodEaten;
}

function getWormPosition() {
  return { x: worm.x, y: worm.y };
}
