import GameObject from "./GameObject";

class Person extends GameObject {
    constructor(config) {
        super(config);

        // Structures that only apply to "people"/character objects
        // Movement structure
        this.movingProgressRemaining = 0;
        this.directionUpdate = {
            "up": ["y", -1], 
            "down": ["y", 1], // add 1 to y
            "left": ["y", -1], 
            "right": ["y", 1], 
        }
    }

    update(state) {
        this.updatePosition();

        if (this.movingProgressRemaining === 0 && this.state.arrow) {
            // Move in this direction
            this.direction = state.arrow;
            this.movingProgressRemaining = 16;
        }
    }

    updatePosition() {
        if (this.movingProgressRemaining > 0) { // if object is in the process of moving
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;
        } 
    }
}

export default Person;