class Enemies extends Person {
    constructor(config) {
        super(config);
        this.isPlayerControlled = false;
        this.behaviourPattern = config.behaviourPattern || [];
        this.behaviourIndex = 0;

        // blob and megablob enemy sprite does not have same amount or variation of frames 
        this.sprite = new VisualRepresentation({
            src: config.spriteSrc,
            animations: config.animations,
            currentAnimation: config.currentAnimation,
            frameWidth: config.frameWidth,
            frameHeight: config.frameHeight,
            animationFrameLimit: config.animationFrameLimit,
            gameObject: this,
        });

       
        this.health = config.health || 100; 
        this.attackPower = config.attackPower || 10; // Default attack power
        this.isAlive = true; // Status to track if the enemy is alive
    }

    // Execute the current behaviour from the behaviour pattern
    performBehaviour(state) {
        if (this.behaviourPattern.length === 0 || !this.isAlive) return;

        const currentBehaviour = this.behaviourPattern[this.behaviourIndex];

        if (currentBehaviour.type === "walk") {
            this.setAnimation(currentBehaviour.direction);
        } else if (currentBehaviour.type === "idle") {
            this.setAnimation("idle-" + currentBehaviour.direction);
        }

        this.startBehaviour(state, currentBehaviour);

        // Cycle to the next behaviour in the pattern
        this.behaviourIndex = (this.behaviourIndex + 1) % this.behaviourPattern.length;
    }

    setAnimation(direction) {
        const animationKey = `walk-${direction}`;
        this.sprite.setAnimation(animationKey);
    }

    
    takeDamage(damageAmount) {
        if (!this.isAlive) return;
        this.health -= damageAmount;
        if (this.health <= 0) {
            this.die();
        }
    }

   
    attack(target) {
        if (this.isAlive && target && target.takeDamage) {
            target.takeDamage(this.attackPower);
        }
    }
    death() {
        this.isAlive = false;
        this.setAnimation("dead"); // check for dead sprite 
        console.log(`${this.name} has died!`);
        
    }
}
