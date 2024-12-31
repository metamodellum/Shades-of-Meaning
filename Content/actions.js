window.Actions = {
    stickWhack: {
        name: "Whack of Justice", // Name of the action,
        description: "Aim true, strike deep.",
        description: "A righteous smack that echoes through the halls of destiny.",
        success: [
          { type: "textMessage", text: "{CASTER} delivers the Whack of Justice to {TARGET}!" },
          { type: "animation", animation: "close" },
          { type: "stateChange", damage: 10 }
        ],
        stickFlurry: {
            name: "Flurry of Smacks",
            description: "An overwhelming barrage of justice-filled bonks.",
            success: [
              { type: "textMessage", text: "{CASTER} unleashes a Flurry of Smacks upon {TARGET}!" },
              { type: "animation", animation: "close" },
              { type: "stateChange", damage: 15 }
            ]
          },
    },
    twoSwordDamage: {
      name: "Double-Edged Dilemma", // Name of the action
      description: "A strike that promises power at a cost. Behold, the paradox of the double-edged sword—both your enemy and your ego will feel the sting.", // Description of the action
      success: [
          { type: "textMessage", text: "{CASTER} swings the Double-Edged Dilemma, embracing the irony of life and battle!" },
          { type: "animation", animation: "sword" },
          { type: "stateChange", damage: 10 },
          { type: "stateChange", damage: 5, onCaster: true }
      ]
  },
  threeSwordDamage: {
      name: "Flash of Regret", // Name of the action
      description: "A blinding strike that leaves no time for second thoughts. It's fast, it's flashy, and, like all great decisions, you’ll regret it later.", // Description of the action
      success: [
          // Displays a text message when the action is used
          { type: "textMessage", text: "{CASTER} unleashes a Flash of Regret—blindingly fast, regretfully powerful!" },
  
          // Plays a white flash animation on the screen to represent the attack
          { type: "animation", animation: "swordFlash", color: "#ffffff" },
  
          // Applies damage state change (15 damage) to the target
          { type: "stateChange", damage: 15 },
  
          // Applies self-damage (5 damage) to the caster, because nothing comes without a cost
          { type: "stateChange", damage: 5, onCaster: true }
      ]
  },
    basicSRDamage: {
      name: "Psychic Flash", // Name of the action
      description: "A burst of psychic energy erupts from the Siphon Ring, overwhelming the target’s senses with blinding force.", // Description of the action
      success: [
          { type: "textMessage", text: "{CASTER} unleashes the Psychic Flash from the Siphon Ring!" },
          { type: "animation", animation: "flash" },
          { type: "stateChange", damage: 15 }
      ]
  },
      oneBombDamage: {
          name: "Oblivion’s Embrace", // Name of the action
          description: "An explosive existential crisis in a singularity of chaos, questioning if destruction is the only true answer.", // Description of the action
          success: [
              { type: "textMessage", text: "{CASTER} hurls THEBOMB, and the universe holds its breath..." },
              { type: "animation", animation: "bomb" },
              { type: "stateChange", damage: 10 }
          ]
      },
      twoBombDamage: {
          name: "Schrödinger's Boom", // Name of the action
          description: "A quantum explosion of uncertainty—simultaneously destructive and harmless, depending on your perspective... and your luck.", // Description of the action
          success: [
              { type: "textMessage", text: "{CASTER} activates Schrödinger's Boom—will it destroy everything, or just a little bit? Only the universe knows." },
              { type: "animation", animation: "bimb" },
              { type: "stateChange", damage: 10 },
              { type: "stateChange", damage: 5, onCaster: true }
          ]
      },    
      
  infiniteLoop: {
    Name: "The Infinite Loop",
    description: "A loop of endless regret. How fitting.",
    success: [
        { type: "textMessage", text: "{CASTER} summons the eternal loop of suffering!" },
        { type: "animation", animation: "pagesFlip", color: "#3b3b3b" },
        { type: "stateChange", damage: 5, status: { type: "looping Damage", expiresIn: 3} },
      { type: "textMessage", text: "{TARGET} is trapped in an endless cycle of pain!" },
    ]
  },
  
    // Defines the 'Existential Dread' status action
    nadirStatus: {
        name: "Existential Dread", // Name of the action
        description: "When you question your purpose, it's hard to hit the mark.", // Description of the action
        success: [
            // Displays a text message when the action is used
            { type: "textMessage", text: "{CASTER} ponders the futility of {ACTION}." },
  
            // Applies a 'dread' status effect to the target for 3 turns (commented animation for future use)
            { type: "stateChange", status: { type: "nadir", expiresIn: 3 } },
  
            // Displays a message when the target misses due to 'dread' status
            { type: "textMessage", text: "{TARGET} is lost in thought and misses!" }
        ]
    },
  
    // Defines the 'The Prism Key' action (an item collection action)
    key_item: {
        name: "The Prism Key", // Name of the item
        description: "You've retrieved The Prism Key", // Description of the item
        targetType: "friendly", // Specifies that the action targets friendly entities
        success: [
            // Displays a text message when the item is collected
            { type: "textMessage", text: "{CASTER} collected The Prism Key" },
  
            // Applies a state change to remove any active status effects (e.g., nullifies status)
            { type: "stateChange", status: null }
        ]
    },
    hp_item: {
      name: "Health potion", // Name of the item
      description: "I feel good", // Description of the item
      targetType: "friendly", // Specifies that the action targets friendly entities
      success: [
          // Displays a text message when the item is collected
          { type: "textMessage", text: "{CASTER} collected The Prism Key" },
  
          // Applies a state change to remove any active status effects (e.g., nullifies status)
          { type: "stateChange", recovery: 10 }
      ]
  }
  }
  