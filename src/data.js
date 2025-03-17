/**
 * Initializes the subject data in the Firestore database.
 * @param {object} game - The game object.
 */
export function initSubject(game) {

}

/**
 * Saves the trial data to the Firestore database.
 * @param {object} scene - The scene object.
 */
export function saveData(game) {
    console.log(game.registry.get("data"));

    const gameData = game.registry.get("data");

    // This is an object, turn it into an array
    const gameDataArray = Object.entries(gameData);
    
    // Format the data for the API request
    const requestData = {
        "task": "cannonball-" + game.registry.get("task") || "default_task",
        "id": game.registry.get("subjectID") || "default_id",
        "session": game.registry.get("session") || "none", 
        "write_mode": "overwrite", 
        "data": gameDataArray.map(([key, value]) => value)
    };

    console.log(requestData);

    // Build the complete API URL using individual registry values
    const apiURL = game.registry.get("apiURL") || "127.0.0.1";
    const apiPort = game.registry.get("apiPort") || 5000;
    const apiEndpoint = game.registry.get("apiEndpoint") || "/submit_data";
    
    // Construct the complete URL
    const fullApiUrl = `http://${apiURL}${apiPort ? `:${apiPort}` : ''}${apiEndpoint}`;

    // Make the POST request to the API endpoint
    fetch(fullApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data successfully saved to API:', data);
    })
    .catch(error => {
        console.error('Error saving data to API:', error);
    });

}
