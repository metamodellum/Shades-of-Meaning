
class Person extends GameObject {
    constructor(config) {
        super(config);

        this.movingProgressRemaining = 0;

        this.isStanding = false;
//used for doggo character, 2 player
        this.isPlayerControlled = config.isPlayerControlled || false;

        // Defines how each direction affects position (x or y) and by how much
        this.directionUpdate = {
            "up": ["y", -1],    // Move up: decrease y by 1
            "down": ["y", 1],   // Move down: increase y by 1
            "left": ["x", -1],  // Move left: decrease x by 1
            "right": ["x", 1],  // Move right: increase x by 1
        };
    }

    
    update(state) {
        
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            
            if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                this.startBehaviour(state, {
                    type: "walk",       
                    direction: state.arrow,
                });
            }

            this.updateSprite(state);
        }
    }

    startBehaviour(state, behaviour) {
        this.direction = behaviour.direction;

        if (behaviour.type === "walk") {
    
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                // If space is blocked and retry is enabled, retry after a short delay
                behaviour.retry && setTimeout(() => {
                    this.startBehaviour(state, behaviour);
                }, 10);
                return; // Exit if the space is blocked
            }

            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = 16;
            this.updateSprite(state);
        }

        if (behaviour.type === "stand") {
            this.isStanding = true;
            setTimeout(() => {
                utils.emitEvent("PersonStandingComplete", {
                    whoId: this.id, // Include the character's ID
                });
                this.isStanding = false; // Reset standing flag
            }, behaviour.time); // Stand for the specified time
        }
    }

    // Handles moving the character one step in the current direction
    updatePosition() {
      
        const [property, change] = this.directionUpdate[this.direction];

        // Update the character's position based on the direction
        this[property] += change;

        // Decrease the remaining movement progress
        this.movingProgressRemaining -= 1;

        if (this.movingProgressRemaining === 0) {
            // Emit an event when walking is complete
            utils.emitEvent("PersonWalkingComplete", {
                whoId: this.id, // Include the character's ID
            });
        }
    }


    updateSprite() {
        if (this.movingProgressRemaining > 0) {

            this.sprite.setAnimation("walk-" + this.direction);
            return;
        }

    
        this.sprite.setAnimation("idle-" + this.direction);
    }

    // Sets the direction of the character without init movement
    setDirection(direction) {
      
        if (!this.directionUpdate[direction]) {
            console.warn(`Invalid direction: ${direction}`);
            return;
        }

        this.direction = direction;

        this.updateSprite();
    }
}
