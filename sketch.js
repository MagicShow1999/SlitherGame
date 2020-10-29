var nutrientsArr = []
var snake 
var AIsnakes = []
var state = 'GAME START'
const MAX_HEADING_CHANGE_FACTOR = 0.5;
const MAPSIZE = 2000
const DRAW_SEGMENT_RATE = 7
function setup() {
  frameRate(60)
  noiseDetail(24)
	createCanvas(windowWidth, windowHeight)
  
	background(0)
  // spawn a player snake
  snake = new Snake(0,0)
	// spawn nutrients in the map
  for (let i = 0; i < 400; i++) {
    nutrientsArr.push(new Nutrient(random(0 - MAPSIZE, MAPSIZE), random(0 - MAPSIZE,MAPSIZE)))
  }
  // spawn AI snakes
  for (let i = 0; i < 5; i++) {
    AIsnakes.push(new Snake(random(-500,500), random(-500,500)))
    // AIsnakes.push(new Snake(200,200))
  }
	
}

function draw() {
  clear();
	background(50)
  stroke(255);  // white
  text("Your length: " + snake.length, 20,20)
  text("Rank:", 20, 40)
  const totalSnakes = [...AIsnakes, snake]
  // totalSnakes.sort(() => {

  // })
  push();
  translate(windowWidth/2 - snake.x, windowHeight/2 - snake.y)

  // make sure the nutrients length is always 400 so that they cannot be depleted
  // while(nutrientsArr.length <= 400) {
  //   nutrientsArr.push(new Nutrient(new Nutrient(random(0 - MAPSIZE, MAPSIZE), random(0 - MAPSIZE,MAPSIZE))))
  // }
  
  if (state == 'GAME START') {
    // noFill();

    // handleAISnakeMovements()

    // update the snake's heading degree according to mouse position
    const heading = headDegree()
    
    snake.update(heading)

  }
  if (state == 'GAME OVER') {
    // console.log('GAMEOVER')
    // keeps AI snakes up and running but won't display player's snake
    
    textSize(40)
    fill(255)
    text(state, 0, 0)
  }
  handleAISnakeMovements()
  nutrientsCollisionHandler()
  snake.display()
  pop();
}
function handleAISnakeMovements() {
  AIsnakes.forEach( aisnake => {
  // console.log(snake.checkCollision(aisnake))
      AIsnakes.forEach ( anotherAI => {
        if (aisnake !== anotherAI && anotherAI.checkCollision(aisnake)) {
          // console.log('ai snakes collide')
        }

      })
      snake.checkCollision(aisnake)
      
      if (aisnake.state == "LIVE" && aisnake.checkCollision(snake)) {
        state = "GAME OVER"
      }
      aisnake.display()
      aisnake.updateAI(nutrientsArr)
    })
}
function nutrientsCollisionHandler() {
  
    nutrientsArr = checkCollision(snake)
    // console.log(nutrientsArr.length)
    AIsnakes.forEach(aisnake => {
      nutrientsArr = checkCollision(aisnake) 
    })
    // console.log(nutrientsArr.length)
}
function checkCollision(snake) {
  for (let i = 0; i < nutrientsArr.length; i++) {
    if(nutrientsArr[i] && nutrientsArr[i].display(snake.x, snake.y, snake.size)) {
        console.log("eaten by", snake.x,snake.y)
        nutrientsArr.splice(i,1)
        snake.grow()
    }
  
  }
  return nutrientsArr
}
// get the mouse heading degree by calculating its arctan value between the middle point of 
// the window and cursor position
function headDegree() {
  const dx = mouseX - windowWidth/2;
  const dy = mouseY - windowHeight/2;
  const headingDegree = Math.atan2(dy, dx);
  const fastMode = mouseIsPressed;
  return { headingDegree, fastMode };
}
function AIheadDegree(x, y, nutrientX, nutrientY) {
  const dx = nutrientX - x 
  const dy = nutrientY - y 
  const headingDegree = Math.atan2(dy, dx);
  const fastMode = false;
  return { headingDegree, fastMode};
}

