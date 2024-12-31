// Define the available weapon types using an object. This helps to avoid hardcoding the type values elsewhere in the code.
window.WeaponTypes = {
  sword: "sword", // Represents a sword weapon
  shield: "shield", // Represents a shield weapon
  bomb: "bomb", // Represents a bomb weapon
  bowarrow: "bowarrow", // Represents a bow and arrow weapon
  ring: "ring",
  book: "book"

};

// Define the weapons and their properties in a separate object for better organization.
window.Weapons = {
  
  // Define a sword weapon (Blade of Woe)
  "BOW": {
      name: "The Sorcerer", // Name of the weapon
      type: WeaponTypes.sword, // Weapon type using the predefined WeaponTypes object
      description: "A cursed blade that whispers to its wielder, thirsting for blood.", // Description of the weapon
      // icon: "images/characters/icons/sworditem.png", // Path to the weapon's icon
      src: "images/characters/sorcerer/idle-down.png", // Path to the weapon's image
      actions: ["oneSwordDamage", "twoSwordDamage", "threeSwordDamage"], // Actions associated with this weapon (e.g., "damage1" could be a damage type or skill)
  },

  // Define a shield weapon (Voidshard Barrier)
  "VB": {
      name: "Voidshard Barrier",
      type: WeaponTypes.shield, // Using shield type
      description: "A shield forged from the fragments of a dying star, pulsating with void energy.",
      icon: "images/characters/icons/shielditem.png",
      src: "images/characters/icons/shielditem.png",
     // Example action for this shield
  },

  // Define a bomb weapon (Tearbomb)
  "TB": {
      name: "Explosives",
      type: WeaponTypes.bomb, // Using bomb type
      description: "haha bomb go BOOM",
      // description: "A weapon so volatile, even its creators were unsure whether it would explode in your hands, in your face, or just awkwardly sit there waiting for a moment of existential crisis. Guaranteed to make an impact, unless it doesn’t. Use with caution, or don’t—it’s probably too late either way.",
      icon: "images/characters/icons/bombitem.png",
      src: "images/characters/icons/bombitem.png",
      actions: ["oneBombDamage", "twoBombDamage"], 
  },

  // Define a bow and arrow weapon (Hollowfang Bow)
  "HFB": {
      name: "Hollowfang Bow",
      type: WeaponTypes.bowarrow, // Using bow and arrow type
      description: "A bow carved from the fangs of a spectral beast, its arrows seek the soul.",
      icon: "images/characters/icons/bowitem.png",
      src: "images/characters/icons/bowitem.png",
      // No actions property for this weapon
  },

  "SR": {
    name: "Siphon Ring",
    type: WeaponTypes.ring,
    description: "A ring pulsating with psychic energy, capable of manipulating the thoughts of its target, assaulting the mind to induce confusion and disorientation. In close-range combat, it can unleash psychic bursts that strike with mental force.",
    icon: "images/characters/icons/ringitem.png",
    src: "images/characters/icons/ringitem.png",
    actions: ["basicSRDamage"]
  },

  "TOG": {
    name: "Obsidian Grimoire",
    type: WeaponTypes.book,
    description: "A book filled with forgotten knowledge... and questionable life choices.",
    icon: "images/characters/icons/bookitem.png",
    src: "images/characters/icons/bookitem.png",
    actions: ["infiniteLoop"]
  }

};
