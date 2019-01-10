const pushNotificationService = require('../services/push-notification.service');
const pushNotificationUserService = require('../services/user.service');
import {
    User
} from '../../projects/shared-library/src/lib/shared/model';

export class PushNotification {



    public sendNotificationToDevices(userId: string, title: string, body: string, data: any): Promise<string> {
        return pushNotificationUserService.getUserById(userId).then((user) => {
            const dbUser: User = user.data();
            const notificationPromises = [];
            if (dbUser.androidPushTokens) {
                dbUser.androidPushTokens.map((token) => {
                    notificationPromises.push(this.sendNotification(token, title, body, data));
                });
            }

            if (dbUser.iosPushTokens) {
                dbUser.iosPushTokens.map((token) => {
                    notificationPromises.push(this.sendNotification(token, title, body, data));
                });
            }

            return Promise.all(notificationPromises)
                .then((notificationResults) => notificationResults)
                .catch((e) => {
                    console.log('user notification stats promise error', e);
                });

        });
    }

    public sendNotification(registrationToken: string, title: string, body: string, data: any): Promise<String> {
        const message = {
            notification: {
                title: title,
                body: body
            },
            data: data,
            token: registrationToken
        };
        return pushNotificationService.sendPush(message);
    }
}
