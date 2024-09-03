const getToken = require('./auth');
const getAuthenticatedClient = require('./graphClient');

const getUsers = async () => {
    const accessToken = await getToken();
    const client = getAuthenticatedClient(accessToken);

    try {
        const users = await client.api('/users')
            .select('id,displayName,userPrincipalName')
            .get();
        return users.value;
    } catch (error) {
        console.error("Error fetching users", error);
        throw error;
    }
};

module.exports = getUsers;
