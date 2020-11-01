// class for Nutrient which can be eaten by snakes and let them grow bigger
class Nutrient {
	constructor(x, y) {
		this.color = color(random(0, 255), random(0, 255), random(0, 255))
		this.rad = 10
		this.x = x
		this.y = y
		// console.log(this.x,this.y)
	}

	display(x, y, snakeRadius) {
		fill(this.color)
		noStroke()

		ellipse(this.x, this.y, this.rad)

		var dis = dist(this.x, this.y, x, y)
		// the collision distance becomes longer if the snake radius (or just size) is large
		if (dis < snakeRadius) {
			return true
		} else {
			return false
		}
	}
	
}