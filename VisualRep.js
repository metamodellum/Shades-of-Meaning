class VisualRepresentation {//sprite animation on canvas
    constructor(config) {
        // Loaing 
        this.image = new Image();
        this.image.src = config.src;
        this.isLoaded = false;

    //notes
        this.image.onload = () => {
            this.isLoaded = true;
        };

        // Animation config
        this.animations = config.animations || {
            "idle-down": [[0, 0]],
            "idle-right": [[0, 1]],
            "idle-up": [[0, 2]],
            "idle-left": [[0, 3]],
            "walk-down": [[1, 0], [0, 0], [3, 0], [2, 0]],
            "walk-right": [[1, 1], [0, 1], [3, 1], [2, 1]],
            "walk-up": [[1, 2], [0, 2], [3, 2], [2, 2]],
            "walk-left": [[1, 3], [0, 3], [3, 3], [2, 3]],
        };
        this.currentAnimation = config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        // Frame timing config
        this.animationFrameLimit = config.animationFrameLimit || 4;
        this.animationFrameProgress = this.animationFrameLimit;

        // Link the sprite to the associated game object.
        this.gameObject = config.gameObject;
    }

    //spite sheet has multiple frames
    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }
    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }
    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        // RESET BBY
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame = (this.currentAnimationFrame + 1) % this.animations[this.currentAnimation].length;
    }

    draw(ctx, cameraPerson) {
        if (!this.isLoaded) return; // make sure aprite is loaded before drawing 

        //position relative to the camera
        const x = this.gameObject.x + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y + utils.withGrid(6) - cameraPerson.y;

        // curr frame 
        const [frameX, frameY] = this.frame;
        ctx.drawImage(
            this.image,
            frameX * 16, frameY * 16, // Source frame position.
            16, 16,                   // Frame size.
            x, y,                     // Position on canvas.
            16, 16                    // Size on canvas.
        );

        //next frame
        this.updateAnimationProgress();
    }

    //THIS DOESNT FUCIING WORK FIVK EM 
    //single sprite image not multiple 
    drawWeapon(ctx, weaponImage, x, y) {
        if (!weaponImage) return; 

        const weaponOffset = 5;
        ctx.drawImage(
            weaponImage,
            0, 0,        
            16, 16,       
            x + weaponOffset, y - weaponOffset, 
            16, 16       
        );
    }
}









