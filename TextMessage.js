class TextMessage {
    constructor({ text, onComplete, faceImage = null }) {
        this.text = text;
        this.onComplete = onComplete;
        this.faceImage = faceImage;
        this.element = null;
        this.revealingText = null;
        this.actionListener = null;
    }
    createElement() {
        //container for the text message.
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        // THSI DOESNT FUCKING WORK 
        this.element.innerHTML = `
            ${this.faceImage ? `<img src="${this.faceImage}" alt="Character Face" class="TextMessage_face">` : ""}
            <p class="TextMessage_p"></p>
            <button class="TextMessage_button">Next</button>
        `;

        
        this.revealingText = new RevealingText({
            element: this.element.querySelector(".TextMessage_p"),
            text: this.text,
        });

       
        this.element.querySelector("button").addEventListener("click", () => {
            this.handleMessageCompletion();
        });

        
        this.actionListener = new KeyPressListener("Enter", () => {
            this.handleMessageCompletion();
        });
    }

    /**
     * Handles message completion by cleaning up and invoking the onComplete callback.
     */
    handleMessageCompletion() {
        if (this.revealingText.isDone) {
            this.cleanup();
            this.onComplete();
        } else {
            this.revealingText.wrapToDone();
        }
    }

    /**
     * Cleans up the DOM and event listeners associated with the message.
     */
    cleanup() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        if (this.actionListener) {
            this.actionListener.unbind();
            this.actionListener = null;
        }
    }

  
    begin(container) {
        if (!container) {
            throw new Error("Container element is required to initialize TextMessage.");
        }

        this.createElement();
        container.appendChild(this.element);
        this.revealingText.begin();
    }
}
