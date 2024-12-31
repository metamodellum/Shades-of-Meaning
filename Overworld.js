class Overworld {
    constructor(config) {
        this.id = null; // Unique identifier for the overworld
        this.element = config.element; // HTML element for game visuals
        this.canvas = this.element.querySelector(".game-canvas"); // Canvas for rendering
        this.ctx = this.canvas.getContext("2d"); // 2D rendering context

        // active game map
        this.map = null;
    }

    // no.1 game loop also renders
    startGameLoop() {
        const step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas

            const cameraPerson = this.map.gameObjects.hero; // Center the camera on the hero

            // Update all game objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction, // Current input
                    map: this.map, // Active map
                });

                // Log grid position for player-controlled objects
                if (object.isPlayerControlled) {
                    const gridX = Math.floor(object.x / 16); // X in grid units (16px tiles)
                    const gridY = Math.floor(object.y / 16); // Y in grid units
                    console.log(`Hero grid position: (${gridX}, ${gridY})`);
                }
            });

            this.map.drawLowerImage(this.ctx, cameraPerson);

            Object.values(this.map.gameObjects)
                .sort((a, b) => a.y - b.y)
                .forEach(object => object.sprite.draw(this.ctx, cameraPerson));

    
            this.map.drawUpperImage(this.ctx, cameraPerson);

            if (!this.map.isPaused) {
                requestAnimationFrame(step);
            }
        };

        step(); // Start the loop
    }

   
    bindActionInput() {
        new KeyPressListener("Enter", () => {
            this.map.checkForActionCutscene();
        });
    }

    
    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                this.map.checkForFootstepCutscene();
            }
        });
    }

  
    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    // Sets up zeee overworld and zeeethe game loop
    begin() {
        this.startMap(window.OverworldMaps.Village); // Load the initial map

        // Bind input and events
        this.bindActionInput();
        this.bindHeroPositionCheck();

        //directional input for player movement
        this.directionInput = new DirectionInput();
        this.directionInput.init();

        // Start the main game loop
        this.startGameLoop();

        // Uncomment to trigger a predefined cutscene
        // this.map.startCutscene([
        //     { type: "battle" },
        //     { type: "changeMap", map: "LodgeRoom" }
        // ]);
    }
}
