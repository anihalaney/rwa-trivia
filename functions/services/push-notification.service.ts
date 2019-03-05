import admin from '../db/firebase.client';

export class PushNotificationService {

    private static pushNotificationMessagingClient = admin.messaging();

    /**
     * sendPush
     * return PushResponse
     */
    static async sendPush(message: any): Promise<any> {
        try {
            const response = await this.pushNotificationMessagingClient.send(message);
            return response;
        } catch (error) {
            console.log('Error : ', error);
            throw error;
        }
    }
}
