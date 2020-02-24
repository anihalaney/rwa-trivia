import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { User, interceptorConstants, pushNotificationRouteConstants } from '../../projects/shared-library/src/lib/shared/model';
import { UserService } from './user.service';

export class PushNotificationService {

    private static pushNotificationMessagingClient = admin.messaging();

    /**
     * sendPush
     * return PushResponse
     */
    static async sendPush(message: any, dbUser: User): Promise<any> {
        try {
            return await PushNotificationService.pushNotificationMessagingClient.send(message);
        } catch (error) {
            if (error.code === pushNotificationRouteConstants.TOKEN_IS_NOT_REGISTERED) {

                if (dbUser.androidPushTokens) {
                    const index = dbUser.androidPushTokens
                    .findIndex((androidPushToken) =>
                        (androidPushToken === message.token ||
                            (androidPushToken && androidPushToken.token && androidPushToken.token === message.token)));
                    if (index > -1) {
                        dbUser.androidPushTokens.splice(index, 1);
                    }
                } else if (dbUser.iosPushTokens) {
                    const index = dbUser.iosPushTokens
                    .findIndex((iosPushToken) =>
                        (iosPushToken === message.token ||
                            (iosPushToken && iosPushToken.token && iosPushToken.token === message.token)));
                        dbUser.iosPushTokens.splice(index, 1);
                }
                return await UserService.updateUser({ ...dbUser });
            } else {
                return Utils.throwError(error);
            }
        }
    }
}
