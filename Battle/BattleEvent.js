class BattleEvent {
  constructor(event, battle) {
    this.event = event; 
    this.battle = battle;  
  }

 
  getTextMessage() {
    return this.event.text
      .replace("{CASTER}", this.event.caster?.name)
      .replace("{TARGET}", this.event.target?.name)
      .replace("{ACTION}", this.event.action?.name);
  }

 
  textMessage(resolve) {
    const text = this.getTextMessage();
    const message = new TextMessage({
      text,
      onComplete: () => resolve(),
    });
    message.begin(this.battle.element);
  }

  
  async stateChange(resolve) {
    const { caster, target, damage, recover, status } = this.event;
    let who = this.event.onCaster ? caster : target;

    if (damage) this.handleDamage(target, damage);
    if (recover) this.handleRecovery(who, recover);
    if (status !== undefined) this.handleStatus(who, status);

    // Wait before resolving the state change
    await utils.wait(600);
    resolve();
  }

  handleDamage(target, damage) {
    target.update({ hp: target.hp - damage });

  }

  handleRecovery(who, recover) {
    let newHp = who.hp + recover;
    who.update({ hp: Math.min(newHp, who.maxHp) });
  }

 
  handleStatus(who, status) {
    if (status === null) {
      who.update({ status: null });
    } else {
      who.update({ status: { ...status } });
    }
  }

  submissionMenu(resolve) {
    const { caster } = this.event;
    const menu = new SubmissionMenu({
      caster,
      enemy: this.event.enemy,
      items: this.battle.items,
      replacements: this.getReplacements(caster),
      onComplete: submission => resolve(submission),
    });
    menu.begin(this.battle.element);
  }

  // Get the list of combatants who can replace the current one
  getReplacements(caster) {
    return Object.values(this.battle.combatants).filter(
      c => c.id !== caster.id && c.team === caster.team && c.hp > 0
    );
  }

  // Show the replacement menu
  replacementMenu(resolve) {
    const menu = new ReplacementMenu({
      replacements: this.getTeamReplacements(),
      onComplete: replacement => resolve(replacement),
    });
    menu.begin(this.battle.element);
  }

  // Get the list of replacements from the team
  getTeamReplacements() {
    return Object.values(this.battle.combatants).filter(
      c => c.team === this.event.team && c.hp > 0
    );
  }

  // Replace the current combatant with a new one
  async replace(resolve) {
    const { replacement } = this.event;

    // Clear out the old combatant and replace
    const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
    this.battle.activeCombatants[replacement.team] = null;
    prevCombatant.update();

    await utils.wait(400);

    this.battle.activeCombatants[replacement.team] = replacement.id;
    replacement.update();

    // Update team components
    this.battle.playerTeam.update();
    this.battle.enemyTeam.update();

    resolve();
  }

  // Grant XP to a combatant
  giveXp(resolve) {
    let amount = this.event.xp;
    const { combatant } = this.event;

    const step = () => {
      if (amount > 0) {
        amount -= 1;
        combatant.xp += 1;
        if (combatant.xp === combatant.maxXp) this.levelUp(combatant);
        combatant.update();
        requestAnimationFrame(step);
        return;
      }
      resolve();
    };
    requestAnimationFrame(step);
  }

  
  levelUp(combatant) {
    combatant.xp = 0;
    combatant.maxXp = 100;
    combatant.level += 1;
  }

  animation(resolve) {
    const fn = BattleAnimations[this.event.animation];
    fn(this.event, resolve);
  }
  
  begin(resolve) {
    this[this.event.type](resolve);
  }
}
