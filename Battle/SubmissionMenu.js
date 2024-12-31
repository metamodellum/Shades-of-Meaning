class SubmissionMenu {
    constructor({ caster, enemy, onComplete, items, replacements }) {
        this.enemy = enemy;
        this.onComplete = onComplete;
        this.replacements = replacements;
        this.caster = caster || {}; // Ensure caster is always an object
        this.caster.action = this.caster.action || []; // Default to empty array if undefined

        let quantityMap = {};
        items.forEach(item => {
            if (item.team === this.caster.team) {
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
        this.items = Object.values(quantityMap);
    }

    getPages() {
        const backOption = {
            label: "Go back",
            description: "Return to previous page",
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
                ...(Array.isArray(this.caster.action) ? this.caster.action : [])
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

    // Method to initialize and render the menu
    begin(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.begin(container);
        this.keyboardMenu.setOptions(this.getPages().root);
    }

    menuSubmit(action, instanceId = null) {
        this.cleanup();
        this.onComplete({
            action,
            instanceId,
            target: this.enemy,
        });
    }

    menuSubmitReplacement(replacement) {
        this.cleanup();
        this.onComplete({
            replacement,
        });
    }

    cleanup() {
        this.keyboardMenu.end();
    }
}
