// Wait for the DOM to be fully loaded before setting up form handlers
document.addEventListener('DOMContentLoaded', function() {
    console.log("Settings page loaded, setting up form...");
    
    // Set up form submission handler
    document.getElementById("gameSettingsForm").addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Collect form values
        const subjectID = document.getElementById("subjectID").value || Math.floor(Math.random() * 2000001).toString();
        const studyID = "CANNONBALL"; // Default study ID
        const session = document.getElementById("session").value || "1";
        const task = document.getElementById("task").value || "MB";
        const testing = document.getElementById("testing").checked ? "TRUE" : "FALSE";
        const short = document.getElementById("short").checked ? "TRUE" : "";
        
        // Build the URL with parameters
        const gameUrl = `game.html?PROLIFIC_PID=${encodeURIComponent(subjectID)}&STUDY=${encodeURIComponent(studyID)}&SESSION=${encodeURIComponent(session)}&TASK=${encodeURIComponent(task)}&TEST=${testing}${short ? '&SHORT=TRUE' : ''}`;
        
        // Redirect to the game page with URL parameters
        window.location.href = gameUrl;
    });
});
