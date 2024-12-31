class TurnCycle {
  constructor({ battle, onNewEvent }) {
      this.battle = battle;
      this.onNewEvent = onNewEvent;
      this.currentTeam = "player"; // Initial team
  }

  // Star turn cycle
  async turn() {
      const caster = this._getCaster();
      const enemy = this._getEnemy(caster);

      const submission = await this._getSubmissionMenu(caster, enemy);

      // Handle weapon replacement
      if (submission.replacement) {
          await this._handleReplacement(submission.replacement);
          return;
      }

      // Handle action execution
      await this._handleAction(submission, caster, enemy);
      // Handle post-turn events
      await this._handlePostEvents(submission, caster);
      // Handle status expiration
      await this._handleStatusExpiration(caster);

      // Move to next turn
      this._nextTurn();
  }

  // Get the caster (current team)
  _getCaster() {
      const casterId = this.battle.activeCombatants[this.currentTeam];
      return this.battle.combatants[casterId];
  }

  // Get the enemy (opposite team)
  _getEnemy(caster) {
      const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
      return this.battle.combatants[enemyId];
  }

  // Fetch the submission menu and handle user input
  async _getSubmissionMenu(caster, enemy) {
      return await this.onNewEvent({
          type: "submissionMenu",
          caster,
          enemy
      });
  }

  // Handle weapon replacement
  async _handleReplacement(replacement) {
      await this.onNewEvent({
          type: "replace",
          replacement
      });
      await this.onNewEvent({
          type: "textMessage",
          text: `You have equipped ${replacement.name}`
      });
      this._nextTurn();
  }

  // Handle action and resulting events
  async _handleAction(submission, caster, enemy) {
      const resultingEvents = caster.getReplacedEvents(submission.action.success);

      for (let event of resultingEvents) {
          await this.onNewEvent({
              ...event,
              submission,
              action: submission.action,
              caster,
              target: submission.target,
          });
      }
  }

  // what happens after the event
  async _handlePostEvents(submission, caster) {
      const postEvents = caster.getPostEvents();

      for (let event of postEvents) {
          await this.onNewEvent({
              ...event,
              submission,
              action: submission.action,
              caster,
              target: submission.target,
          });
      }
  }

  // status removal 
  // async _handleStatusExpiration(caster) {
  //     const expiredEvent = caster.decrementStatus();
  //     if (expiredEvent) {
  //         await this.onNewEvent(expiredEvent);
  //     }
  // }

  // WHOS NEXT 
  _nextTurn() {
      this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
      this.turn();
  }

  
  // getWinningTeam() {
  //     const aliveTeams = {};

  //     Object.values(this.battle.combatants).forEach(c => {
  //         if (c.hp > 0) {
  //             aliveTeams[c.team] = true;
  //         }
  //     });

  //     if (!aliveTeams["player"]) return "enemy";
  //     if (!aliveTeams["enemy"]) return "player";
  //     return null;
  // }

  //
  async init() {
      if (this.battle.enemy) {
          await this.onNewEvent({
              type: "textMessage",
              text: `OK!`
          });
      } else {

      }

      // Start the first turn!
      this.turn();
  }
}
