class Combatant {
  constructor(config, battle) {
    console.log("Creating Combatant with config:", config);
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    });
    this.battle = battle;
    
  }

  get hpPercent() {
    const percent = this.hp / this.maxHp * 100;
    return percent > 0 ? percent : 0;
  }

  // get xpPercent() {
  //   const percent = (this.xp / this.maxXp) * 100;
  //   return percent > 0 ? percent : 0;

    
  // }

  // get isActive() {
  //   return  this.battle.activeCombatants[this.team] === this.id;
  // }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("Combatant");
    this.hudElement.setAttribute("data-combatant", this.id);
    // this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = `
      <p class="Combatant_name">${this.name}</p>
      <p class="Combatant_level"></p>
      <div class="Combatant_character_crop">
        <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
      </div>
      // <img class="Combatant_type" src="${this.icon}" alt="${this.type}" />
      <svg viewBox="0 0 90 3" class="Combatant_life-container">
        <rect x="0" y="0" width="0%" height="1" fill="#82ff71" />
        <rect x="0" y="1" width="0%" height="2" fill="#3ef126" />
      // </svg>
      // <svg viewBox="0 0 100 1" class="Combatant_xp-container">
      //   <rect x="0" y="0" width="0%" height="1" fill="#ffd76a" />
      //   <rect x="0" y="1" width="0%" height="1" fill="#ffc934" />
      // </svg>
      <p class="Combatant_status"></p>
    `;

    this.weaponElement = document.createElement("img");
    this.weaponElement.classList.add("Weapon");
    this.weaponElement.setAttribute("src", this.src);
    this.weaponElement.setAttribute("alt", this.name);
    // this.weaponElement.setAttribute("data-team", this.team);

    this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
    // this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");

    // console.log(`XP Percent for ${this.name}: ${this.xpPercent}%`);
    // console.log(this.xpFills); // Check if the rect elements are correctly selected
  }

  update(changes = {}) {
    Object.keys(changes).forEach(key => {
      this[key] = changes[key];
    });

  
    this.hudElement.setAttribute("data-active", this.isActive);
    this.weaponElement.setAttribute("data-active", this.isActive);
  
    this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`);
    // this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`);
  
    // Update level
    // this.hudElement.querySelector(".Combatant_level").innerText = this.level;
    // const levelElement = this.hudElement.querySelector(".Combatant_level");
    // if (levelElement) {
    //   levelElement.innerText = this.level;
    // }
  
    // const statusElement = this.hudElement.querySelector(".Combatant_status");

      // if (this.status) {
      //   statusElement.innerText = this.status.type;
      //   statusElement.style.display = "block";
      // } else {
      //   statusElement.innerText = "";
      //   statusElement.style.display = "none";
      // }
    } 
    
    getReplacedEvents(originalEvents) {
      if (this.status?.type === "looping Damage") {
          return [
              { type: "textMessage", text: `${this.name} writhes in the endless cycle of regret!` },
              { type: "textMessage", text: "The loop tightens, and pain becomes eternal..." },
              { type: "stateChange", damage: 5 },
          ];
      }
      
      return originalEvents;
  }
  
  getPostEvents() {
      if (this.status?.type === "looping Damage" && this.status.expiresIn <= 0) {
          return [
              { type: "textMessage", text: "The loop releases its grip, but the scars remain." },
              { type: "stateChange", status: null }, // Removing the status once the loop ends
          ];
      }
      return [];
  }

    getReplacedEvents(originalEvents) {

    if (this.status?.type === "nadir" && utils.randomFromArray([true, false, true])) {
      return [
        { type: "textMessage", text: `At rock bottom, the only way is up...or is it?` },
        // { type: "textMessage", text: `${this.name} flops over!` },
      ]
    }

    return originalEvents;
  }
  

  getPostEvents() {
    if (this.status?.type === "zenith") {
        return [
            { type: "textMessage", text: "You've reached the top- just remember, the fall is always waiting" },
            { type: "stateChange", recover: 5, onCaster: true },
        ]
    }
    return [];
}

decrementStatus(){
  if(this.status?.expiresIn > 0) {
    this.status.expiresIn -= 1;
    if(this.status.expiresIn === 0){
      this.update({
        status:null
      })
      return{
        type: "textMessage",
        text: "Status expired!"
      }
    }
  }
  return null;
}

  begin(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.weaponElement);
    this.update();
  }
}
