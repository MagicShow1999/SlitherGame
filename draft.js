function startGame() {

  // spawn a player snake
  const p = colorinp.value().split(',')
  snake = new Snake(0,0, nameinp.value(), p)
  state = "GAME START"
  nameinp = null 
  colorinp = null 
  button = null
}


textSize(20)
fill(0, 102, 153)
// textAlign(CENTER)
text("Welcome to play slither remake!", windowWidth/2 - 300, windowHeight/2-250)
text("Pick your snake color by entering rgb color separated by ',' !", windowWidth/2 - 300, windowHeight/2 - 200)
colorinp = createInput('')
colorinp.position(windowWidth/2 - 295, windowHeight/2 - 150)
text("What's your snake's name?", windowWidth/2 - 300, windowHeight/2 - 100)
nameinp = createInput('')
nameinp.position(windowWidth/2 - 295, windowHeight/2 - 50)

button = createButton("submit");
button.position(windowWidth/2 - 295, windowHeight/2);
button.mousePressed(startGame);