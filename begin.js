(function () {
    // Create a new instance of the Overworld class
    const overworld = new Overworld({
        element: document.querySelector(".game-container") // Pass in the DOM element where the game will run
    });

    // Initialize the overworld (start the game loop and load the map)
    overworld.begin();
})();

