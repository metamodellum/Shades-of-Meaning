class SubmissionMenu {
    constructor({ caster, enemy, onComplete, items, replacements}) {
        this.enemy = enemy;
        this.onComplete = onComplete;
        this.replacements = replacements;

        console.log({replacements})

        let quantityMap = {};
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
              }
           }
          }
        })
        this.items = Object.values(quantityMap);
      }

      getPages() {
        const backOption = {
            label: "Go back",
            description: "Return to prev page",
            handler: () => {
                this.keyboardMenu.setOptions(this.getPages().root);
            }
        };
    
        return {
            root: [
                {
                    label: "Attack",
                    description: "Choose an attack",
                    handler: () => {
                        this.keyboardMenu.setOptions(this.getPages().attacks);
                    }
                },
                {
                    label: "Items",
                    description: "Choose an item",
                    handler: () => {
                        this.keyboardMenu.setOptions(this.getPages().items);
                    }
                },
                {
                    label: "Swap",
                    description: "Change to another weapon",
                    handler: () => {
                        this.keyboardMenu.setOptions(this.getPages().replacements);
                    }
                },
            ],
            attacks: [
                ...(this.caster.actions || [])
                    .map(key => {
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
                            }
                        };
                    })
                    .filter(option => option !== null),
                backOption
            ],
            items: [
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
                        }
                    };
                }),
                backOption
            ],
            replacements: [
                ...(this.replacements || []).map(replacement => ({
                    label: replacement.name,
                    description: replacement.description,
                    handler: () => {
                        this.menuSubmitReplacement(replacement);
                    }
                })),
                backOption
            ]
            
        };
    }

    menuSubmitReplacement(replacement){
        this.keyboardMenu?.end();
        this.onComplete({
            replacement
        })
    }
    

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
    
    

    decide() {
        // Use the first action by default
        this.menuSubmit(Actions[this.caster.actions[0]]);
    }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions (this.getPages().root )
    }

    init(container) {

   
            this.showMenu(container)
      
        
    }
}
