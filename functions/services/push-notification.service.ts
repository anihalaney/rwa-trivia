import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class PushNotificationService {

    private static pushNotificationMessagingClient = admin.messaging();

    /**
     * sendPush
     * return PushResponse
     */
    static async sendPush(message: any): Promise<any> {
        try {
            return await this.pushNotificationMessagingClient.send(message);
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
