const cca = require('./msalConfig');

const getToken = async () => {
    const tokenRequest = {
        scopes: ["https://graph.microsoft.com/.default"],
    };

    try {
        const response = await cca.acquireTokenByClientCredential(tokenRequest);
        return response.accessToken;
    } catch (error) {
        console.error("Error acquiring token", error);
        throw error;
    }
};

module.exports = getToken;
