const getToken = require('./auth');
const getAuthenticatedClient = require('./graphClient');

const sendMail = async (toEmail, subject, content) => {
    const accessToken = await getToken();
    const client = getAuthenticatedClient(accessToken);

    const mail = {
        message: {
            subject: subject,
            body: {
                contentType: "Text",
                content: content,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: toEmail,
                    },
                },
            ],
        },
    };

    try {
        await client.api('/me/sendMail')
            .post(mail);
        console.log("Mail sent successfully");
    } catch (error) {
        console.error("Error sending mail", error);
        throw error;
    }
};

module.exports = sendMail;
