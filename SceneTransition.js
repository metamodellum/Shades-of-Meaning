class SceneTransition {
    constructor() {
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("SceneTransition");
    }

    fadeOut(callback) {
        this.element.classList.add("fade-out");
        this.element.addEventListener("animationend", () => {
            this.element.remove();
            callback(); 
        }, { once: true });
    }

    begin(container, callback) {
        this.createElement();
        container.appendChild(this.element);
        this.element.addEventListener("animationend", () => {
            callback(); 
        }, { once: true });
    }
}
