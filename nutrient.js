// class for Nutrient which can be eaten by snakes and let them grow bigger
class Nutrient {
	constructor(x, y) {
		this.color = color(random(0, 255), random(0, 255), random(0, 255))
		this.rad = 10
		// this.noiseOffsetX = random(1000,2000)
		// this.noiseOffsetY = random(2000,3000)
	
		// this.x = map(noise(this.noiseOffsetX), -1, 1, -1000, 1000)
		// this.y = map(noise(this.noiseOffsetY), -1, 1, -1000, 2000)
		this.x = x
		this.y = y
		// console.log(this.x,this.y)
	}

	display(x, y, snakeRadius) {
		fill(this.color)
		noStroke()
		ellipse(this.x, this.y, this.rad)

		var dis = dist(this.x, this.y, x, y)
		if (dis < snakeRadius) {
			return true
		} else {
			return false
		}
	}
	
}