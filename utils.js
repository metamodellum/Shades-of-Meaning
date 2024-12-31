const utils = {
    // Convert a grid unit into pixels (1 grid unit = 16 pixels)
    withGrid(n) {
        return n * 16;
    },

    // Convert grid coordinates into a formatted string
    asGridCoords(x, y) {
        return `${x * 16},${y * 16}`;
    },

    // Calculate the next position based on a starting point and direction
    nextPosition(initialX, initialY, direction) {
        let x = initialX; // Start with the initial X coordinate
        let y = initialY; // Start with the initial Y coordinate
        const size = 16;  // Each grid unit corresponds to 16 pixels

        // Adjust the X or Y coordinate depending on the direction
        switch (direction) {
            case "left":
                x -= size; // Move left (decrease X)
                break;
            case "right":
                x += size; // Move right (increase X)
                break;
            case "up":
                y -= size; // Move up (decrease Y)
                break;
            case "down":
                y += size; // Move down (increase Y)
                break;
        }

        // Return the new position as an object
        return { x, y };
    },

    // Return the opposite of a given direction
    oppositeDirection(direction) {
        switch (direction) {
            case "left": return "right";
            case "right": return "left";
            case "up": return "down";
            case "down": return "up";
        }
    },

    // Wait for a specified number of milliseconds
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Select a random element from an array
    randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Emit a custom event with a name and optional details
    emitEvent(name, detail) {
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    }
};