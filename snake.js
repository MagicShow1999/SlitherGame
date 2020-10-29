
class Snake {

	constructor(x,y) {
		this.length = 20
		this.size = this.calculateSize(this.length)
		// this.size = 50
		this.parts = []
		this.x = x
		this.y = y
		this.heading = 0
		this.state = 'LIVE'
		this.lastDrawn = DRAW_SEGMENT_RATE
		this.color = color(random(0), random(0,255), random(0,255))
		this.calledOnce = true
		// for AI snakes only
		this.hasTarget = false
		this.noiseOffset = noise(random(0, 1000))
		this.nutrient = undefined;
		this.nearestNutrient = nutrientsArr[0]
	}

	calculateSize(length) {
	  return 1.5 * Math.pow(length, 0.6);
	}

	limitRange(number, limit) {
	  if (number > limit) {
	    return limit;
	  } else if (number < -limit) {
	    return -limit;
	  }
	  return number;
	}

	// calculate radians between two angles
	differenceBetweenAngles(angleA, angleB) {
	  let difference = angleB - angleA
	  while (difference < -Math.PI) {
	  	difference += 2 * Math.PI
	  }
	  while (difference > Math.PI) {
	  	difference -= 2 * Math.PI
	  } 
	  return difference
	}
	// update moving snake
	update({ headingDegree, fastMode }) {

	  // calculate the snake previous heading degree and current desired degree
	  const delta = this.differenceBetweenAngles(this.heading, headingDegree);
	  // set max heading change factor according to its size (bigger size will have lower turning rate)
	  const maxHeadingChange = 1 / this.size;
	  const allowedDelta = this.limitRange(delta, maxHeadingChange)
	  
	  this.heading += allowedDelta;
	  // only allows acceleration if length is over 10
	  const isFast = fastMode && this.length > 10;
	  const speed = isFast ?  2 : 1;
	  
	  this.x += Math.cos(this.heading) * speed;
	  this.y += Math.sin(this.heading) * speed;
	 

	  // draw the snake body parts in a certain frame count
	  // the default is 7 
	  if (this.lastDrawn <= 0) {
	  	// console.log(this.parts.length)
	    this.parts.push({x: this.x, y: this.y});
	    this.lastDrawn = DRAW_SEGMENT_RATE;
	  } else {
	  	// the framecount reduces more if the snake is accelerating 
	    this.lastDrawn -= speed + 0;
	  }
	  // the snake begins to shift if the length of the body parts array is longer than it's expected
	  if (this.parts.length > this.length) {
	    const last = this.parts.shift();
	  }


	  this.size = this.calculateSize(this.length);
	  
	  return this;
	}
	// handle AI snake's movement:
	// if it has a target (food) to eat, he will keep on that direction until he eats the food
	// otherwise, it will roam randomly 
	// In both cases, it will try its best to avoid colliding with other snakes' bodies.
	updateAI() {
		// console.log(this.hasTarget)
		if (!this.hasTarget) {
			nutrientsArr.forEach ( nutrient => {
				const dis = dist(nutrient.x, nutrient.y, this.x, this.y)
				// console.log('123')
				if (dis < 100) {
					this.hasTarget = true
					this.nutrient = nutrient
					// console.log(nutrient)
				}
				 
			})
			this.update({headingDegree: map(this.noiseOffset, 0, 1, -3.14, 3.14), fastMode: false})
			this.noiseOffset++
		}
		// console.log(this.heading)
		else {
			const dis = dist(this.nutrient.x, this.nutrient.y, this.x, this.y)
			if (dis <= 10) {
				this.hasTarget = false
				// this.update({headingDegree: random(-3.14,3.14), fastMode: false})
				
			} 
			// console.log(AIheadDegree(this.x, this.y, this.nutrient.x, this.nutrient.y))
			this.update(AIheadDegree(this.x, this.y, this.nutrient.x, this.nutrient.y))
				
			
			
		}
	}
	grow() {
		this.length += 2
	}
	// make the snake parts separate and stop moving
	die() {
		this.parts.forEach( part => {
			push();
			translate(part.x, part.y);
			// spawn new nutrients at the location where the snake dies
			if (this.calledOnce) {
				nutrientsArr.push(new Nutrient(this.x, this.y))
				nutrientsArr.push(new Nutrient(part.x, part.y))
			}
			pop();
		})
		this.speed = 0
		this.calledOnce = false
	}
	// check collision with other snakes' body
	checkCollision(that) {
		if (that.state == "LIVE") {
			that.parts.forEach( part => {
				const dis = dist(part.x, part.y, this.x, this.y)
				// console.log(dis)
				if (dis < 20) {
					this.state = 'DEAD'
					return true
				} 
			})
			return false
		} else {
			return true
		}

		
	}
	display() {
		// console.log(this.state)
		if (this.state == 'DEAD') {
			this.die()
			// console.log(nutrientsArr.length)
		}
		if (this.state == 'LIVE') {
			fill(this.color)
			// draw body parts
			this.parts.forEach((part) => {
				push();
				translate(part.x, part.y);
				stroke(this.color)
				ellipse(0, 0, this.size);
				pop();
			});
			push();
			translate(this.x, this.y);
			rotate(this.heading);
			// setup the scope that snakes can move
			if (this.x > MAPSIZE || this.x < MAPSIZE) {
				this.x = constrain(this.x, 0 - MAPSIZE, MAPSIZE)
			}
			
			if (this.y > MAPSIZE || this.y < MAPSIZE) {
				this.y = constrain(this.y, 0 - MAPSIZE, MAPSIZE)
			}
			ellipse(0, 0, this.size);

			// draw two eyes
			fill(255)
			ellipse(this.size * 0.2,  this.size * 0.2, this.size * 0.3)
			fill(0)
			ellipse(this.size * 0.2,  this.size * 0.2, this.size * 0.1)
			
			fill(255)
			ellipse(this.size * 0.2,  0 - this.size * 0.2, this.size * 0.3)
			fill(0)
			ellipse(this.size * 0.2,  0 - this.size * 0.2, this.size * 0.1)
			pop();
		}
		
	}
}