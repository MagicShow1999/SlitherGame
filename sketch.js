var nutrientsArr = []
var snake 
var AIsnakes = []
var state = 'GAME START'

function setup() {
  frameRate(60)
  noiseDetail(24)
	createCanvas(windowWidth, windowHeight)
  
	background(0)
  // spawn a player snake
  snake = new Snake(0,0)
	// spawn nutrients in the map

  for (let i = 0; i < 400; i++) {
    nutrientsArr.push(new Nutrient(random(-2000, 2000), random(-2000,2000)))
  }
  for (let i = 0; i < 1; i++) {
    AIsnakes.push(new Snake(random(0,100), random(0,100)))
  }
	
}

function draw() {
  clear();
	background(50)
  stroke(255);  // white
  text("Your length: " + snake.length, 20,20)
  
  push();
  translate(windowWidth/2 - snake.x, windowHeight/2 - snake.y)

  // make sure the nutrients length is always 400 so that they cannot be depleted
  while(nutrientsArr.length <= 400) {
    nutrientsArr.push(new Nutrient(random(0 - snake.x - 50, snake.x + 50), random(0 - snake.y - 50, snake.y + 50)))
  }
  
  
  if (state == 'GAME START') {
    // noFill();

    AIsnakes.forEach( aisnake => {
      
      nutrientsCollisionHandler(aisnake)
      console.log(snake.checkCollision(aisnake))
      if (snake.state == "LIVE" && snake.checkCollision(aisnake)) {

        console.log('Player snake died')
        snake.die()
        state = "GAME OVER"
      }
      if (aisnake.state == "LIVE" && aisnake.checkCollision(snake)) {
        
        // state = "GAME OVER"
        console.log('AI snake died')
      }
      aisnake.display()
      aisnake.updateAI()
    })

   
    snake.display()

    
    // update the snake's heading degree according to mouse position
    
    const heading = headDegree()
    nutrientsCollisionHandler(snake)
    snake.update(heading)

  }
  if (state == 'GAME OVER') {
    console.log('GAMEOVER')
    // keeps AI snakes up and running but won't display player's snake
    handleAISnakeMovements()
    snake.die()
    textSize(40)
    fill(255)
    text(state, 0,0)
  }
 
  pop();
}
function handleAISnakeMovements() {
   AIsnakes.forEach( aisnake => {
        aisnake.display()
        aisnake.updateAI()
        nutrientsCollisionHandler(aisnake)
  })
}
function nutrientsCollisionHandler(snake) {
  for (let i = 0; i < nutrientsArr.length; i++) {
    if(nutrientsArr[i] && nutrientsArr[i].display(snake.x, snake.y, snake.size)) {
      nutrientsArr.splice(i,1)
      snake.grow()
      i--
    }
  }
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

