class SubmissionMenu {
  constructor({ caster, enemy, onComplete, items, replacements }) {
      this.enemy = enemy;
      this.onComplete = onComplete;
      this.replacements = replacements;

      console.log({ replacements });

      this.items = this._mapItems(caster, items);
  }

 
  _mapItems(caster, items) {
      const quantityMap = {};

      items.forEach(item => {
          if (item.team === caster.team) {
              let existing = quantityMap[item.actionId];
              if (existing) {
                  existing.quantity += 1;
              } else {
                  quantityMap[item.actionId] = {
                      actionId: item.actionId,
                      quantity: 1,
                      instanceId: item.instanceId,
                  };
              }
          }
      });

      return Object.values(quantityMap);
  }

  // Generate the pages of the menu
  getPages() {
      const backOption = this._createBackOption();

      return {
          root: this._getRootPage(backOption),
          attacks: this._getAttacksPage(backOption),
          items: this._getItemsPage(backOption),
          replacements: this._getReplacementsPage(backOption),
      };
  }

  // Create a back option to return to the previous page
  _createBackOption() {
      return {
          label: "Go back",
          description: "Return to the previous page",
          handler: () => {
              this.keyboardMenu.setOptions(this.getPages().root);
          },
      };
  }

  // Root page options
  _getRootPage(backOption) {
      return [
          {
              label: "Attack",
              description: "Choose an attack",
              handler: () => {
                  this.keyboardMenu.setOptions(this.getPages().attacks);
              },
          },
          {
              label: "Items",
              description: "Choose an item",
              handler: () => {
                  this.keyboardMenu.setOptions(this.getPages().items);
              },
          },
          {
              label: "Swap",
              description: "Change to another combatant",
              handler: () => {
                  this.keyboardMenu.setOptions(this.getPages().replacements);
              },
          },
      ];
  }

  // Attacks page options
  _getAttacksPage(backOption) {
      return [
          ...(this.caster.actions || []).map(key => {
              const action = Actions[key];
              if (!action) {
                  console.error(`Action with key '${key}' is undefined`);
                  return null;
              }
              return {
                  label: action.name,
                  description: action.description,
                  handler: () => {
                      this.menuSubmit(action);
                  },
              };
          }).filter(option => option !== null),
          backOption,
      ];
  }

  // Items page options
  _getItemsPage(backOption) {
      return [
          ...(this.items || []).map(item => {
              const action = Actions[item.actionId];
              if (!action) {
                  console.error(`Action with id '${item.actionId}' is undefined`);
                  return null;
              }
              return {
                  label: action.name,
                  description: action.description,
                  right: () => "x" + item.quantity,
                  handler: () => {
                      this.menuSubmit(action, item.instanceId);
                  },
              };
          }),
          backOption,
      ];
  }

  // Replacements page
  _getReplacementsPage(backOption) {
      return [
          ...(this.replacements || []).map(replacement => ({
              label: replacement.name,
              description: replacement.description,
              handler: () => {
                  this.menuSubmitReplacement(replacement);
              },
          })),
          backOption,
      ];
  }

  // submissions
  menuSubmit(action, instanceId = null) {
      if (!action) {
          console.error("menuSubmit called with undefined action");
          return;
      }

      this.keyboardMenu?.end();
      this.onComplete({
          action,
          target: action.targetType === "friendly" ? this.caster : this.enemy,
      });
  }

  // Handle replacement submission
  menuSubmitReplacement(replacement) {
      this.keyboardMenu?.end();
      this.onComplete({
          replacement,
      });
  }
  decide() {
      this.menuSubmit(Actions[this.caster.actions[0]]);
  }

  // Show menu
  showMenu(container) {
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(container);
      this.keyboardMenu.setOptions(this.getPages().root);
  }

  
  init(container) {
      this.showMenu(container);
  }
}
