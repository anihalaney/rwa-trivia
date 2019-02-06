const pushNotificationFireBaseClient = require('../db/firebase-client');
const pushNotificationMessagingClient = pushNotificationFireBaseClient.messaging();

/**
 * sendPush
 * return PushResponse
 */
exports.sendPush = (message: any): Promise<any> => {
    // Send a message to the device corresponding to the provided
    // registration token.
    return pushNotificationMessagingClient.send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            return response;
        })
        .catch((error) => {
            console.log('Error sending message:', error);
            return error;
        });
};


