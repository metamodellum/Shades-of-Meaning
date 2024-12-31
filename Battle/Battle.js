class Battle {
  constructor() {
    this.combatants = this.initializeCombatants();
    this.activeCombatants = this.setActiveCombatants();
    this.items = this.initializeItems();
  }

  // Init all combats
  initializeCombatants() {
    return {
      "player1": this.createCombatant(Weapons.BOW, Weapons.TB, "player"),
      "player2": this.createCombatant(Weapons.TB, "player"),
      "player3": this.createCombatant(Weapons.VB, "player"),
      "player4": this.createCombatant(Weapons.HFB, "player"),
      "enemy1": this.createCombatant(Weapons.SR, "enemy"),
      "enemy2": this.createCombatant(Weapons.SR, "enemy", 25),
    };
  }

  
  createCombatant(weapon1, weapon2 = null, team = "player", hp = 100) {
    return new Combatant({
      ...weapon1,
      ...(weapon2 ? { ...weapon2 } : {}),
      team: team,
      hp: hp,
      maxHp: hp,
      level: 1,
      maxXp: 100,
      xp: 100,
      status: null,
      isPlayerControlled: team === "player"
    }, this);
  }

  // Set the default active combatants
  setActiveCombatants() {
    return {
      player: "player1",
      enemy: "enemy1",
    };
  }

  // init items dring battle
  initializeItems() {
    return [
      { actionId: "key_item", instanceId: "k1", team: "player" },
    ];
  }

  
  getTarget(caster) {
    console.log(`Getting target for: ${caster.name}`);

//dead or alive
    const potentialTargets = Object.values(this.combatants).filter(
      combatant => combatant.team !== caster.team && combatant.hp > 0
    );

    if (potentialTargets.length === 0) {
      console.log("No valid targets found.");
      return null;
    }

    //first available target
    const target = potentialTargets[0];
    console.log(`Target selected: ${target.name}`);
    return target;
  }

  
  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = `
      <div class="Battle_enemy">
          <img src='/images/characters/sorcerer/idle-down.gif' data-id="enemy" alt="Enemy" />
      </div>
      <div class="Battle_hero">
          <img src='/images/characters/main-characters/hero/idle-up.gif' data-id="hero" alt="Hero" />
      </div>
    `;
  }

 
  begin(container) {
    this.createElement();
    container.appendChild(this.element);

    // Init all combts
    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.begin(this.element);
    });

    // Init the turn cycle
    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.begin(resolve);
        });
      }
    });

  
    this.turnCycle.begin();
  }
}
