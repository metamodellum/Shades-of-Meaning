
class GameObject {
    constructor(config) {
        this.isMounted = false
        this.x = config.x || 0;
        this.y = config.y || 0;

        this.direction = config.direction || "down";

  
        this.sprite = new VisualRepresentation({
            gameObject: this,
            src: config.src || "/images/characters/hero/spriteupdate.png", 
        });

        // bahve events 
        this.behaviourLoop = config.behaviourLoop || [];
        this.behaviourLoopIndex = 0; 

        // dialog or interactions)
        this.talking = config.talking || [];
    }


    mount(map) {
        console.log("Mounting"); 

   
        this.isMounted = true;

       
        map.addWall(this.x, this.y);

    
        setTimeout(() => {
            this.doBehaviourEvent(map);
        }, 10); // Small delay
    }
    update() {
        
    }
    async doBehaviourEvent(map) {
        if (!map || map.isCutscenePlaying || this.behaviourLoop.length === 0 || this.isStanding) {
            console.warn("Behavior event skipped:", {
                map,
                isCutscenePlaying: map?.isCutscenePlaying,
                behaviourLoop: this.behaviourLoop,
                isStanding: this.isStanding,
            });
            return;
        }
    
        let eventConfig = this.behaviourLoop[this.behaviourLoopIndex];
        if (!eventConfig) {
            console.error("Invalid behavior event config:", this.behaviourLoopIndex, this.behaviourLoop);
            return;
        }
        eventConfig.who = this.id || "unknown";
    
        try {
            const eventHandler = new OverworldEvent({ map, event: eventConfig });
            await eventHandler.begin();
    
            this.behaviourLoopIndex = (this.behaviourLoopIndex + 1) % this.behaviourLoop.length;
            this.doBehaviourEvent(map); // Continue loop
        } catch (error) {
            console.error("Error in doBehaviourEvent:", error);
        }
    }
}    