let cachedToken = null;
let tokenExpiration = 0;

export async function getAuthToken() {
    const currentTime = Math.floor(Date.now() / 1000);

    //Use cached token if still valid
    if (cachedToken && currentTime < tokenExpiration) {
        console.log("Using cached Auth0 token.");
        return cachedToken;
    }

    console.log("Fetching new Auth0 token from backend...");
    try {
        const response = await fetch("http://meyer-squared-95db07154bdc.herokuapp.com/api/v1/auth/get-token");

        if (!response.ok) {
            throw new Error("Failed to retrieve Auth0 token");
        }

        const data = await response.json();
        cachedToken = data.access_token;
        tokenExpiration = Math.floor(Date.now() / 1000) + data.expires_in - 60; // Buffer time

        return cachedToken;
    } catch (error) {
        console.error("Error fetching token:", error);
        throw error;
    }
}
