import admin from '../db/firebase.client';
const pushNotificationMessagingClient = admin.messaging();

export class PushNotificationService {

    /**
     * sendPush
     * return PushResponse
     */
    static async sendPush(message: any): Promise<any> {
        try {
            const response = await pushNotificationMessagingClient.send(message);
            console.log('Successfully sent message:', response);
            return response;
        } catch (error) {
            console.log('Error sending message:', error);
            throw error;
        }
    };
}

