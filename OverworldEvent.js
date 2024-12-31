class OverworldEvent {
    constructor({ map, event }) {
        this.map = map; // Reference to the active map
        this.event = event; // Event details (type, who, direction, etc.)
    }

    // Handles standing behavior for a specific game object
    stand(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehaviour(
            { map: this.map },
            {
                type: "stand",
                direction: this.event.direction,
                time: this.event.time,
            }
        );

        const completeHandler = (e) => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandingComplete", completeHandler);
                resolve();
            }
        };
        document.addEventListener("PersonStandingComplete", completeHandler);
    }

    // Handles walking behavior for a specific game object
    walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehaviour(
            { map: this.map },
            {
                type: "walk",
                direction: this.event.direction,
                retry: true, // Allow retries if movement fails
            }
        );

        const completeHandler = (e) => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        };
        document.addEventListener("PersonWalkingComplete", completeHandler);
    }

    // Displays a text message to the player
    textMessage(resolve) {
        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve(),
        });
        message.begin(document.querySelector(".game-container"));
    }

    // Transitions to a new map
    changeMap(resolve) {
        const sceneTransition = new SceneTransition();

        sceneTransition.begin(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
            sceneTransition.fadeOut(() => {
                resolve();
            });
        });
    }

    // Initiates a battle sequence
    battle(resolve) {
        const battle = new Battle({
            onComplete: () => resolve(),
        });

        battle.begin(document.querySelector(".game-container"));
    }

    // Pauses the game and opens the pause menu
    pause(resolve) {
        this.map.isPaused = true;
        const menu = new PauseMenu({
            onComplete: () => {
                resolve();
                this.map.isPaused = false;
                this.map.overworld.startGameLoop();
            },
        });
        menu.begin(document.querySelector(".game-container"));
    }

    // Executes the event based on its type
    begin() {
        return new Promise((resolve) => {
            this[this.event.type](resolve);
        });
    }
}