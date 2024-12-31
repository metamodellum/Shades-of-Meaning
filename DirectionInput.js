class DirectionInput {
    constructor() {
        // Array to store the currently held movement directions.
        this.heldDirections = [];

        this.map = {
            "ArrowUp": "up",    // Up arrow key moves up
            "KeyW": "up",       // W key moves up
            "ArrowDown": "down",// Down arrow key moves down
            "KeyS": "down",     // S key moves down
            "ArrowRight": "right", // Right arrow key moves right
            "KeyD": "right",    // D key moves right
            "ArrowLeft": "left",// Left arrow key moves left
            "KeyA": "left",     // A key moves left
        };
    }


    get direction() {
        return this.heldDirections[0];
    }

    
    begin() {
      
        document.addEventListener("keydown", e => {
            const dir = this.map[e.code]; // 
            // If the key corresponds to a direction and is not already in heldDirections, add it.
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir); // Add the direction to the start of the array.
            }
        });

       
        document.addEventListener("keyup", e => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);

      
            if (index > -1) {
                this.heldDirections.splice(index, 1); // Remove the direction from the array.
            }
        });
    }
}