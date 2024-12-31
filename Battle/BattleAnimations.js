const BattleAnimations = {
  async close(event, onComplete) {
    const enemyContainer = document.querySelector(".Battle_enemy");
    const heroContainer = document.querySelector(".Battle_hero");

    // Helper to set animation and optionally flip the image
    function setAnimation(container, gif, flip = false) {
      const img = container.querySelector("img");
      if (img) {
        img.src = gif; // Set the source of the image
        // Apply the flip transformation if required
        img.style.transform = flip ? 'scaleX(-1)' : ''; // Flip horizontally if 'flip' is true
      }
    }

    // Helper for delays
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

  
    const containerWidth = document.querySelector(".Battle").offsetWidth;
    const containerHeight = document.querySelector(".Battle").offsetHeight;

    // Set original positions based on new starting points
    const heroOriginalLeft = 40;
    const heroOriginalTop = containerHeight - 90;
    const enemyOriginalLeft = containerWidth - 30 - 16 * 2.5;
    const enemyOriginalTop = 50;

    // Move a character
    async function moveCharacter(container, left, top, duration) {
      return new Promise(resolve => {
        container.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
        setTimeout(resolve, duration);
      });
    }

    // Step 1: Both walk slightly up (hero) and down (enemy)
    setAnimation(heroContainer, "images/characters/main-characters/hero/walk-up.gif", false); // Flip hero GIF
    setAnimation(enemyContainer, "images/characters/sorcerer/walking-down.gif", false); // No flip for enemy GIF

    await Promise.all([
      moveCharacter(heroContainer, heroOriginalLeft, heroOriginalTop - 50, 1000), // Hero moves up
      moveCharacter(enemyContainer, enemyOriginalLeft, enemyOriginalTop + 20, 1000) // Enemy moves down
    ]);

    // Step 2: Turn both characters to face each other
    setAnimation(heroContainer, "images/characters/main-characters/hero/walk-right.gif", false); // No flip for hero GIF
    setAnimation(enemyContainer, "images/characters/sorcerer/walking-right.gif", true); // Flip enemy GIF

    // Step 3: Both move toward the center
    await Promise.all([
      moveCharacter(heroContainer, heroOriginalLeft + 110, heroOriginalTop - 50, 1000), // Hero moves right
      moveCharacter(enemyContainer, enemyOriginalLeft - 110, heroOriginalTop - 50, 1000) // Enemy moves right
    ]);

    // Step 4: Hero attacks, enemy reacts with hurt animation
    setAnimation(heroContainer, "images/characters/main-characters/hero/attack-right.gif", false); // No flip for hero GIF
    setAnimation(enemyContainer, "images/characters/sorcerer/hurt-right.gif", true); // Flip enemy GIF

    // Play hurt sound effect
    const hurtSound = new Audio("audio/Hurt01.wav");
    hurtSound.play().catch(err => console.error("Error playing hurt sound:", err));

    await delay(300); // Wait for the enemy's hurt animation to finish

    // Step 5: Reset to idle animations
    setAnimation(heroContainer, "images/characters/main-characters/hero/idle-right.gif", false); // No flip for hero GIF
    setAnimation(enemyContainer, "images/characters/sorcerer/idle-right.gif", false); // No flip for enemy GIF

    // Step 6: Both characters walk back to their original positions
    setAnimation(heroContainer, "images/characters/main-characters/hero/walk-right.gif", true); // Flip hero GIF
    setAnimation(enemyContainer, "images/characters/sorcerer/walking-left.gif", false); // No flip for enemy GIF

    await Promise.all([
      moveCharacter(heroContainer, heroOriginalLeft, heroOriginalTop - 50, 1000), // Hero moves back left
      moveCharacter(enemyContainer, enemyOriginalLeft, heroOriginalTop - 50, 1000) // Enemy moves back left
    ]);

    setAnimation(heroContainer, "images/characters/main-characters/hero/walk-down.gif", false); // No flip for hero GIF
      setAnimation(enemyContainer, "images/characters/sorcerer/walking-up.gif", false); // No flip for enemy GIF
    await Promise.all([
      moveCharacter(heroContainer, heroOriginalLeft, heroOriginalTop, 1000), // Hero moves down
      moveCharacter(enemyContainer, enemyOriginalLeft, enemyOriginalTop, 1000) // Enemy moves down
    ]);

    // Step 7: Complete animation callback
    if (onComplete) {
      setAnimation(heroContainer, "images/characters/main-characters/hero/idle-up.gif", false); // No flip for hero GIF
      setAnimation(enemyContainer, "images/characters/sorcerer/idle-down.gif", false); // No flip for enemy GIF
      onComplete();
    }
  },

  async flash(event, onComplete) {
    const enemyContainer = document.querySelector(".Battle_enemy");
    const heroContainer = document.querySelector(".Battle_hero");

    function setAnimation(container, gif, flip = false) {
      const img = container.querySelector("img");
      if (img) {
        img.src = gif; // Set the source of the image
        // Apply the flip transformation if neded
        img.style.transform = flip ? 'scaleX(-1)' : ''; // Flip horizontally if 'flip' is true
      }
    }

    // Helper for delays
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    
    const containerWidth = document.querySelector(".Battle").offsetWidth;
    const containerHeight = document.querySelector(".Battle").offsetHeight;

    // og starting points 
    const heroOriginalLeft = 40;
    const heroOriginalTop = containerHeight - 90;
    const enemyOriginalLeft = containerWidth - 30 - 16 * 2.5;
    const enemyOriginalTop = 50;

    // Move
    async function moveCharacter(container, left, top, duration) {
      return new Promise(resolve => {
        container.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
        setTimeout(resolve, duration);
      });
    }

    // Step 1: Both walk slightly up (hero) and down (enemy)
    setAnimation(heroContainer, "images/characters/main-characters/hero/walk-up.gif", false);
    setAnimation(enemyContainer, "images/characters/sorcerer/walking-down.gif", false);

    await Promise.all([
      moveCharacter(heroContainer, heroOriginalLeft, heroOriginalTop - 50, 1000), // Hero moves up
      moveCharacter(enemyContainer, enemyOriginalLeft, enemyOriginalTop + 20, 1000) // Enemy moves down
    ]);

    // Step 2: Turn both characters to face each other
    setAnimation(heroContainer, "images/characters/main-characters/hero/walk-right.gif", false);
    setAnimation(enemyContainer, "images/characters/sorcerer/walking-right.gif", true);

    // Step 3: Both move toward the center
    await Promise.all([
      moveCharacter(heroContainer, heroOriginalLeft + 110, heroOriginalTop - 50, 1000), // Hero moves right
      moveCharacter(enemyContainer, enemyOriginalLeft - 110, heroOriginalTop - 50, 1000) // Enemy moves right
    ]);

    await delay(250); // Wait for the hero's attack animation to finish
    setAnimation(enemyContainer, "images/characters/sorcerer/attack-right.gif", true);

  

    // Add the magic effect during the attack
    heroContainer.classList.add("magic-effect");

       // Step 4: Hero attacks, enemy reacts with hurt animation
   setAnimation(heroContainer, "images/characters/main-characters/hero/hurt-right.gif", false);

    // Play hurt sound effect
    const hurtSound = new Audio("audio/Hurt01.wav");
    hurtSound.play().catch(err => console.error("Error playing hurt sound:", err));

    await delay(300); // Wait for the enemy's hurt animation to finish

    // Remove the magic effect after the attack
    heroContainer.classList.remove("magic-effect");

    // Step 5: Reset to idle animations
    setAnimation(heroContainer, "images/characters/main-characters/hero/idle-right.gif", false);
    setAnimation(enemyContainer, "images/characters/sorcerer/idle-right.gif", false);

    // Step 6: Both characters walk back to their original positions
    setAnimation(heroContainer, "images/characters/main-characters/hero/walk-right.gif", false);
    setAnimation(enemyContainer, "images/characters/sorcerer/walking-left.gif", true);

    await Promise.all([
      moveCharacter(heroContainer, heroOriginalLeft, heroOriginalTop - 50, 1000),
      moveCharacter(enemyContainer, enemyOriginalLeft, heroOriginalTop - 50, 1000)
    ]);

    await Promise.all([
      moveCharacter(heroContainer, heroOriginalLeft, heroOriginalTop, 1000),
      moveCharacter(enemyContainer, enemyOriginalLeft, enemyOriginalTop, 1000)
    ]);

    // Step 7: Complete animation callback
    if (onComplete) {
      setAnimation(heroContainer, "images/characters/main-characters/hero/idle-up.gif", false);
      setAnimation(enemyContainer, "images/characters/sorcerer/idle-down.gif", false);
      onComplete();
    }
  },
  async pagesFlip(event, onComplete) {
    const enemyContainer = document.querySelector(".Battle_enemy");
    const heroContainer = document.querySelector(".Battle_hero");
    const battleContainer = document.querySelector(".Battle");

    // Helper to set animation and optionally flip the image
    function setAnimation(container, gif, flip = false) {
      const img = container.querySelector("img");
      if (img) {
        img.src = gif;
        img.style.transform = flip ? 'scaleX(-1)' : '';
      }
    }

    // Helper for delays
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Add the page flip effect to the battle container
    function addPageFlipEffect() {
      const flipDiv = document.createElement("div");
      flipDiv.classList.add("page-flip-effect");
      battleContainer.appendChild(flipDiv);

      // Animate the flip effect
      flipDiv.style.animation = "pageFlip 1s linear";

      return new Promise(resolve => {
        flipDiv.addEventListener("animationend", () => {
          battleContainer.removeChild(flipDiv);
          resolve();
        });
      });
    }

    // Step 1: Characters prepare for the spell
    setAnimation(heroContainer, "images/characters/main-characters/hero/cast-spell.gif", false);
    setAnimation(enemyContainer, "images/characters/sorcerer/idle-right.gif", true);

    await delay(500); // Wait for spell preparation

    // Step 2: Trigger the page flip effect
    await addPageFlipEffect();

    // Step 3: Apply damage or reaction to the enemy
    setAnimation(enemyContainer, "images/characters/sorcerer/hurt-right.gif", true);

    // Play hurt sound effect
    const hurtSound = new Audio("audio/Hurt01.wav");
    hurtSound.play().catch(err => console.error("Error playing hurt sound:", err));

    await delay(300); // Wait for hurt animation

    // Step 4: Reset to idle animations
    setAnimation(heroContainer, "images/characters/main-characters/hero/idle-up.gif", false);
    setAnimation(enemyContainer, "images/characters/sorcerer/idle-down.gif", false);

    // Step 5: Complete animation callback
    if (onComplete) onComplete();
  },
  async bomb(event, onComplete) {
    const enemyContainer = document.querySelector(".Battle_enemy");
    const heroContainer = document.querySelector(".Battle_hero");
  
    // Helper to set animation and optionally flip the image
    function setAnimation(container, gif, flip = false) {
      const img = container.querySelector("img");
      if (img) {
        img.src = gif;
        img.style.transform = flip ? 'scaleX(-1)' : '';
      }
    }
  
    // Helper for delays
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // Get container dimensions
    const containerWidth = document.querySelector(".Battle").offsetWidth;
    const containerHeight = document.querySelector(".Battle").offsetHeight;
  
    // Set original positions based on new starting points
    const heroOriginalLeft = 40;
    const heroOriginalTop = containerHeight - 90;
    const enemyOriginalLeft = containerWidth - 30 - 16 * 2.5;
    const enemyOriginalTop = 50;
  
    // Move a character
    async function moveCharacter(container, left, top, duration) {
      return new Promise(resolve => {
        container.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
        setTimeout(resolve, duration);
      });
    }
  
    // Step 1: Both characters move toward each other
    setAnimation(enemyContainer, "images/characters/sorcerer/walking-down.gif", false); // Enemy moves down
  
    // Step 3: Place the bomb near the enemy
    const bomb = document.createElement("div");
    bomb.classList.add("bomb");
    enemyContainer.appendChild(bomb);
    
    // Trigger the bomb explosion animation
    bomb.classList.add("explode");
  
    // Play the bomb sound effect
    const bombSound = new Audio("audio/BombExplosion.wav");
    bombSound.play().catch(err => console.error("Error playing bomb sound:", err));
  
    await delay(500); // Wait for bomb explosion
  
    // Step 4: Add hurt animation to the enemy
    setAnimation(enemyContainer, "images/characters/sorcerer/hurt-down.gif", true);
  
  
    // Step 7: Complete animation callback
    if (onComplete) {
      setAnimation(enemyContainer, "images/characters/sorcerer/idle-down.gif", true);
      onComplete();
    }
  },
    async swordFlash (event, onComplete) {
      // Create the sword flash element
      const flash = document.createElement('div');
      flash.classList.add('sword-flash');
      
      // Append the flash element to the body or battle container
      document.body.appendChild(flash);
  
      // Wait for the animation to complete before cleaning up
      await new Promise(resolve => {
        flash.addEventListener('animationend', () => {
          // Remove the flash element from the DOM after the animation ends
          flash.remove();
          resolve();
        });
      });
  
      // Trigger any additional logic after animation is completed (onComplete callback)
      if (onComplete) onComplete();
    },
      async bimb(event, onComplete) {
        // Select the element you want to shake (usually the whole screen or a specific container)
        const battleContainer = document.querySelector('body'); // Or a specific container if needed
    
        // Add the 'bimb-shake' class to trigger the screen shake animation
        battleContainer.classList.add('bimb-shake');
    
        // Wait for the animation to complete
        await new Promise(resolve => {
          battleContainer.addEventListener('animationend', () => {
            // Remove the class after the animation ends to reset the element
            battleContainer.classList.remove('bimb-shake');
            resolve();
          });
        });
    
        // Trigger any additional logic after the animation is complete (onComplete callback)
        if (onComplete) onComplete();
      },
      
    };
