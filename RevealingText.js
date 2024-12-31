class RevealingText {
    constructor(config) {
        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed || 70; // Fixed to use `speed` not `element`

        this.timeout = null;
        this.isDone = false;
    }

    revealOneCharacter(characters) {
        if (!characters.length) {
            this.isDone = true;
            return;
        }

        const { span, delayAfter } = characters.shift(); // Get the first character
        span.classList.add("revealed"); // Add a class to reveal the character

        // Set a timeout to reveal the next character
        this.timeout = setTimeout(() => {
            this.revealOneCharacter(characters);
        }, delayAfter);
    }

    wrapToDone() {
        clearTimeout(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll("span").forEach(s => {
            s.classList.add("revealed")
        })
    }

    begin() {
        const characters = [];
        this.text.split("").forEach((character) => {
            const span = document.createElement("span");
            span.textContent = character;
            this.element.appendChild(span);

            characters.push({
                span,
                delayAfter: character === " " ? 0 : this.speed, // Adjust speed for spaces
            });
        });

        this.revealOneCharacter(characters);
    }
}
