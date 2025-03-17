// Firebase
import { signInAndGetUid, db } from "./firebaseSetup.js";
import { initSubject } from "./data.js";
// Other things
import { extractUrlVariables, applyGameConfig } from "./utils.js";
import gameConfig from "./gameConfig.js";
import triggerManager from '../external/eeg-trigger-js/triggerManager.js';

/**
 * Function to check the start of the game.
 *
 * @param {string} uid - The user ID.
 */
var startGame = function (uid) {
    // Get URL variables
    let { subjectID, testing, studyID, short, task, session } = extractUrlVariables();

    // Clear start element and scroll to top
    document.getElementById("start").innerHTML = "";
    window.scrollTo(0, 0);
    
    // Initialize the trigger manager with mappings
    triggerManager.initialize('127.0.0.1', 5001, './triggerMappings.json')
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

        // Apply configuration settings to the game (given in config.js)
        applyGameConfig(game, task);

        // Set testing flag
        game.config.testing = testing === "FALSE" ? false : true;

        // Set study ID
        game.config.studyID = studyID;

        // Short version for testing?
        game.registry.set("short", short);

        // Store task type in registry
        game.registry.set("task", task);

        // Store the database and uid in the game config
        // game.config.db = db; 
        game.config.uid = uid;

        // Initialise the subject in the database
        // Try to initialize the subject
        try {
            initSubject(game);
        } catch (error) {
            // Log a warning if initialization fails
            console.warn("Failed to initialise subject:", error);
            // Set a flag in the registry to indicate initialization failure
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
    // Sign in and start the game
    // signInAndGetUid()
    //     .then((uid) => {
    //         console.log("Signed in with UID:", uid);
    //         startGame(uid); // Pass uid as an argument to startGame
    //     })
    //     .catch((error) => {
    //         console.error("Sign-in failed:", error);
    //     });
    
    
    startGame();
});
