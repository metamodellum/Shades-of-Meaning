class OverworldMap {
    constructor(config) {
        this.overworld = null;

        // Game objects present on the map
        this.gameObjects = config.gameObjects;

        // Cutscene spaces and walls on the map
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};

        // Map layers
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = null;
        this.isPaused = null;
    }

    // Draws the lower layer of the map, adjusted for the camera position
    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    // Draws the upper layer of the map, adjusted for the camera position
    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    // Checks if a specific space on the map is blocked by a wall
    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    // Mounts all game objects defined for the map
    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            const object = this.gameObjects[key];
            object.id = key;
            object.mount(this);
        });
    }

    // Starts a sequence of events as a cutscene
    async startCutscene(events) {
        this.isCutscenePlaying = true;

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            });
            await eventHandler.begin();
        }

        this.isCutscenePlaying = false;

        // Reset NPCs to idle state after the cutscene
        Object.values(this.gameObjects).forEach(object => object.doBehaviourEvent(this));
    }

    // Checks for action-based cutscenes (e.g., interacting with objects)
    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);

        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x}, ${object.y}` === `${nextCoords.x}, ${nextCoords.y}`;
        });

        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events);
        }
    }

    // Checks for cutscenes triggered by stepping on certain spaces
    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events);
        }
    }

    // Adds a wall at a specific grid coordinate
    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }

    // Removes a wall at a specific grid coordinate
    removeWall(x, y) {
        delete this.walls[`${x},${y}`];
    }

    // Moves a wall from one position to another in a given direction
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY); // Remove the wall from its old position
        const { x, y } = utils.nextPosition(wasX, wasY, direction); // Get the new position
        this.addWall(x, y); // Add the wall to the new position
    }
}


// Map configurations
window.OverworldMaps = {
    LodgeRoom: {
        lowerSrc: "/images/maps/lodge/roomLower.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                isPlayerControlled: true,
            }),
            doggo: new Person({
                x: utils.withGrid(6),
                y: utils.withGrid(6),
                src: "/images/characters/main-characters/doggo/walking.png",
            }),
        },
        walls: {
            [utils.asGridCoords(7, 5)]: true,
            [utils.asGridCoords(6, 5)]: true,
            [utils.asGridCoords(5, 5)]: true,
            [utils.asGridCoords(5, 6)]: true,
            [utils.asGridCoords(5, 7)]: true,
            [utils.asGridCoords(6, 4)]: true,
            [utils.asGridCoords(7, 4)]: true,
            [utils.asGridCoords(5, 4)]: true,
           

        },
        cutsceneSpaces: {
            [utils.asGridCoords(4,8)]: [
                {
                    events: [
                        { type: "changeMap", map: "Village"}
                    ]
                }
            ]
        }
    },
    Village: {
        lowerSrc: "/images/maps/VillageUpper.png", // Lower layer image for the room
        upperSrc: "", // No upper layer image
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(3),
                y: utils.withGrid(6),
                isPlayerControlled: true, // Player-controlled character
                following: false,
            }),
            snake: new Enemies({
                x: utils.withGrid(5),
                y: utils.withGrid(11),
                spriteSrc: "images/characters/enemies/snakesprite.png",
                behaviourLoop: [
                    {type: "stand", direction: "left", time: 800},
                    {type: "stand", direction: "up", time: 800},
                    {type: "stand", direction: "right", time: 1200},
                    {type: "stand", direction: "up", time: 300},

                ],PlayerControlled: false,
                // following: true,
            }),
            princess: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(8),
                src: "/images/characters/NPC/princess/sprite.png",
                behaviourLoop: [
                    {type: "stand", direction: "left", time: 800},
                    {type: "stand", direction: "up", time: 800},
                    {type: "stand", direction: "right", time: 1200},
                    {type: "stand", direction: "up", time: 300},

                ],
            }),
            NPCB: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(13),
                src: "/images/characters/NPC/NPCB.png",
                behaviourLoop: [
                    // {type: "walk", direction: "left"},
                    // {type: "stand", direction: "up", time: 800},
                    // {type: "walk", direction: "up"},
                    // {type: "walk", direction: "right"},
                    // {type: "walk", direction: "down"},
                        {type: "stand", direction: "left", time: 800},
                        {type: "stand", direction: "up", time: 800},
                        {type: "stand", direction: "right", time: 1200},
                        {type: "stand", direction: "up", time: 300},

                ],
                talking: [
                    {
                        events: [
                            // { type: "textMessage", text: },
                            { type: "textMessage", text: "Merchant: Ah, Hero. Heard you’re off to save the Princess’s mutt. You’ll be needing a weapon.", faceHero: "NPCB"},
                            {type: "textMessage", text: "Got anything legendary? Maybe a sword that radiates heroic destiny?" },
                            {type: "textMessage", text: "Merchant: How about this stick?" },
                            {type: "textMessage", text: "...A stick?" },
                            {type: "textMessage", text:  "Merchant: Not just any stick. It whispers truths."},
                            {type: "textMessage", text: "What kind of truths?" },
                            {type: "textMessage", text: "Stick of Truth: Observation: Your fashion sense is subpar." },
                            {type: "textMessage", text: "Fantastic. Insults and splinters." },
                            {type: "textMessage", text: "Merchant:Take it or leave it." },
                            {type: "textMessage", text: "Fine. Give me the stick. If I die, I’m haunting you."},
                            {type: "textMessage", text: "Stick of Truth: Observation: His house is flammable." },
                            {type: "textMessage", text: "Merchant(nervously): Enjoy your quest!" },






                        ]
                    }
                ]
            }),
        },
        walls: {

            [utils.asGridCoords(5, 6)]: true,
            [utils.asGridCoords(1, 6)]: true,
            [utils.asGridCoords(0,7)]: true,
            [utils.asGridCoords(0, 6)]: true,
            [utils.asGridCoords(0, 5)]: true,
            [utils.asGridCoords(2, 5)]: true,
            [utils.asGridCoords(1, 5)]: true,

            [utils.asGridCoords(3, 13)]: true,
            [utils.asGridCoords(2, 13)]: true,
            [utils.asGridCoords(1,13)]: true,
            [utils.asGridCoords(0, 13)]: true,
            [utils.asGridCoords(0, 14)]: true,
            [utils.asGridCoords(1, 14)]: true,
            [utils.asGridCoords(1, 15)]: true,
            [utils.asGridCoords(2, 15)]: true,

            [utils.asGridCoords(0, 12)]: true,
            [utils.asGridCoords(1, 12)]: true,
            [utils.asGridCoords(2,12)]: true,
            [utils.asGridCoords(3, 12)]: true,
            [utils.asGridCoords(4, 9)]: true,
            [utils.asGridCoords(3, 9)]: true,
            [utils.asGridCoords(3, 10)]: true,
            [utils.asGridCoords(4, 10)]: true,
        },

        cutsceneSpaces: {
            [utils.asGridCoords(13,0)]: [
                {
                    events: [
                        {type: "changeMap", map:"Forest1"},

                    ]
                }
            ],
            // [utils.asGridCoords(5,8)]: [
            //     {
            //         events: [
            //             {type: "changeMap", map:"LodgeRoom"}
            //         ]
            //     }
            // ],
            // [utils.asGridCoords(5,8)]: [
            //     {
            //         events: [
            //             {type: "textMessage", text: "Well, well! Look who finally decided to join the land of the awake!", },
            //             {type: "textMessage", text: "I was starting to think you’d fused with that bed up there. Cozy, isn’t it?", },
            //             {type: "textMessage", text: "It was a bit bloomy last night, eh...?", },
            //             {type: "textMessage", text: "...", },
            //             {type: "textMessage", text: "Oh, you don’t remember? Typial...", },
            //         ]
            //     }
            // ],
            [utils.asGridCoords(3,7)]: [
                {
                    events: [
                        {type: "textMessage", text: "PRINCESS: Hero! Finally, I’ve found you!", faceHero: "princess"},
                        {type: "textMessage", text: "YOU: Impressive. Most people can’t summon the energy to care.", faceHero: "princess"},
                        {type: "textMessage", text: "PRINCESS: Chroma is missing!"},

                        {type: "textMessage", text: "YOU: Oh no, not your dog. The cornerstone of our community’s emotional well-being."},
                        {type: "textMessage", text: "PRINCESS: Don’t mock me! Chroma is more than a dog! Chroma is…"},
                        {type: "textMessage", text: "PRINCESS: well, he’s the only thing that brings me joy in this dismal wasteland! You must find him.", },
                        {type: "textMessage", text: "YOU: Why not ask the Knight of Slightly Darker Gray? Or the Wizard of Faintly Light Gray?"},
                        {type: "textMessage", text: "PRINCESS: They’re busy debating paint samples for the new town square bench. Besides, you’re…"},
                        
                        {type: "textMessage", text: "PRINCESS: Free"},
                        {type: "textMessage", text: "(She’s not wrong.)"},

                        {type: "textMessage", text: "YOU: Fine. I’ll find your dog. But I’m not doing this for you. I’m doing this for…"},
                        {type: "textMessage", text: "YOU: uh…", },
                        {type: "textMessage", text: "YOU: existential relief?"},
                        {type: "textMessage", text: "PRINCESS: Whatever motivates you. Just bring him back!"},







                    ]
                }
            ]
        }
    },
    "Forest1": {
        lowerSrc: "images/maps/forest/forest1.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                isPlayerControlled: true,
            }),
            
        },
        walls: {
            [utils.asGridCoords(7, 5)]: true,
            [utils.asGridCoords(6, 5)]: true,
            [utils.asGridCoords(5, 5)]: true,
        },
        
        cutsceneSpaces: {
            [utils.asGridCoords(15, 7)]: [
                {
                    events: [
                        { type: "changeMap", map: "forest2" }
                    ],
                },
                
            ],
            
        },
        
    },
    "forest2": {
        lowerSrc: "images/maps/forest/forest2.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                isPlayerControlled: true,
            }),
        },
        walls: {
            [utils.asGridCoords(7, 5)]: true,
            [utils.asGridCoords(6, 5)]: true,
            [utils.asGridCoords(5, 5)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoords(15, 7)]: [
                {
                    events: [
                        { type: "changeMap", map: "forest3" }
                    ]
                }
            ]
        }
    },
    "forest3": {
        lowerSrc: "images/maps/forest/forest3.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                isPlayerControlled: true,
            }),
            snake: new Enemies({
                x: utils.withGrid(5),
                y: utils.withGrid(8),
                spriteSrc: "images/characters/enemies/snakesprite.png",
                
                behaviourLoop: [
                    {type: "stand", direction: "left", time: 800},
                    {type: "stand", direction: "up", time: 800},
                    {type: "stand", direction: "right", time: 1200},
                    {type: "stand", direction: "up", time: 300},

                ],PlayerControlled: false,
                // following: true,
            }),
    
            
        },
        walls: {
            [utils.asGridCoords(7, 5)]: true,
            [utils.asGridCoords(6, 5)]: true,
            [utils.asGridCoords(5, 5)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoords(15, 6)]: [
                {
                    events: [
                        { type: "changeMap", map: "forest4" }
                    ]
                }
            ]
        }
    },
    "forest4": {
        lowerSrc: "images/maps/forest/forest4.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                isPlayerControlled: true,
            }),
            snake: new Enemies({
                x: utils.withGrid(5),
                y: utils.withGrid(8),
                spriteSrc: "images/characters/enemies/snakesprite.png",
                
                behaviourLoop: [
                    {type: "stand", direction: "left", time: 800},
                    {type: "stand", direction: "up", time: 800},
                    {type: "stand", direction: "right", time: 1200},
                    {type: "stand", direction: "up", time: 300},

                ],PlayerControlled: false,
                // following: true,
            }),
    
            
        },
        walls: {
            [utils.asGridCoords(7, 5)]: true,
            [utils.asGridCoords(6, 5)]: true,
            [utils.asGridCoords(5, 5)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoords(0, 7)]: [
                {
                    events: [
                        { type: "changeMap", map: "Village" }
                    ]
                }
            ]
        }
    },
    
        
};