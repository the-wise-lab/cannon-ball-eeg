// Firebase
import { signInAndGetUid, db } from "./firebaseSetup.js";
import { initSubject } from "./data.js";
// Other things
import { extractUrlVariables, applyGameConfig } from "./utils.js";
import gameConfig from "./gameConfig.js";
import triggerManager from 'https://cdn.jsdelivr.net/gh/the-wise-lab/eeg-trigger-js@main/triggerManager.js';

/**
 * Function to check the start of the game.
 */
var startGame = function () {
    // Get URL variables
    let { subjectID, testing, studyID, short, task, session, 
          dataServerURL, dataServerPort, triggerServerURL, triggerServerPort } = extractUrlVariables();

    // Clear start element and scroll to top
    document.getElementById("start").innerHTML = "";
    window.scrollTo(0, 0);
    
    // Initialize the trigger manager with mappings
    triggerManager.initialize(triggerServerURL, parseInt(triggerServerPort), './triggerMappings.json')
        .then(() => {
            console.log('Trigger manager initialized and mappings loaded');
            // Send game start trigger
            return triggerManager.sendTriggerByEvent('game.start', 'Game initialization');
        })
        .catch(error => {
            console.error('Failed to initialize trigger manager:', error);
        });

    // Wait a bit before starting
    setTimeout(function () {
        // Create the game with the configuration object defined above
        let game = new Phaser.Game(gameConfig);
        
        // Store trigger manager in game registry for use throughout the game
        game.registry.set("triggerManager", triggerManager);

        // Subject and study IDs stored in registry
        game.registry.set("subjectID", subjectID);
        game.registry.set("studyID", studyID.toLowerCase());
        game.registry.set("session", session);

        // Apply configuration settings to the game (given in config.js)
        applyGameConfig(game, task);
        
        // Override server settings from URL
        game.registry.set("apiURL", dataServerURL);
        game.registry.set("apiPort", parseInt(dataServerPort));

        // Set testing flag
        game.config.testing = testing === "FALSE" ? false : true;

        // Set study ID
        game.config.studyID = studyID;

        // Short version for testing?
        game.registry.set("short", short);

        // Store task type in registry
        game.registry.set("task", task);

        // Store the database and uid in the game config
        game.config.uid = subjectID; // Using subjectID as uid

        // Initialise the subject in the database
        try {
            initSubject(game);
        } catch (error) {
            console.warn("Failed to initialise subject:", error);
            game.registry.set("init_subject_failed", true);
        }

        // Store the start time in the registry
        game.registry.set("start_time", new Date());

        // Create an object within the game to store responses
        game.registry.set("data", {});
    }, 1000);
};

// Wait for the DOM to be fully loaded before starting the game
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, starting game...");
    startGame();
});
