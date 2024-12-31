class ChoiceMenu {
    constructor({ choices, onComplete }) {
        this.choices = choices; // { label: "Choice Text", action: () => {} }
        this.onComplete = onComplete; 
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("ChoiceMenu");

        this.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.textContent = choice.label;
            button.classList.add("ChoiceMenu-button");
            button.addEventListener("click", () => {
                this.close();
                choice.action();
                this.onComplete(choice);
            });
            this.element.appendChild(button);
        });
    }

    begin(container) {
        this.createElement();
        container.appendChild(this.element);
    }

    close() {
        this.element.remove();
    }
}
