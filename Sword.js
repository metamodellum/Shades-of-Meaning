class Sword extends GameObject {
    constructor(config) {
        super(config);

        this.sprite = new VisualRepresentation({
            gameObject: this,
            src: config.src || "/images/characters/icons/sworditem.png", // Default 
        });

        this.offset = config.offset || { x: 16, y: 0 }; // Default 
    }

    update(state) {
        if (state.player?.isPlayerControlled) {
            const player = state.playe
            this.x = player.x + this.offset.x;
            this.y = player.y + this.offset.y;
            this.updateRotation(player.direction);
        }
    }

    updateRotation(direction) {
        const rotationAngles = {
            up: -90,
            down: 90,
            left: 180,
            right: 0,
        };

        this.sprite.angle = rotationAngles[direction] || 0; // Default 
    }

}
    
    
    // draw(ctx, cameraPerson) {
    //     if (!this.sprite.isLoaded) return;

    //     // Calculate the sword's position relative to the camera
    //     const x = this.x + utils.withGrid(10.5) - cameraPerson.x;
    //     const y = this.y + utils.withGrid(6) - cameraPerson.y;

    //     // Draw the sword with the correct rotation
    //     ctx.save();
    //     ctx.translate(x + 8, y + 8); // Center the sword on its position
    //     ctx.rotate((this.sprite.angle * Math.PI) / 180); // Apply rotation
    //     ctx.drawImage(
    //         this.sprite.image,
    //         -8, -8, // Offset to center the sword image
    //         16, 16  // Size of the sword
    //     );
    //     ctx.restore();
    // }



