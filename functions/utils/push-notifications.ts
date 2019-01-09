const pushNotificationService = require('../services/push-notification.service');

export class PushNotification {


    public sendNotification(registrationToken: string): Promise<String> {
        const message = {
            data: {
                score: '850',
                time: '2:45'
            },
            token: registrationToken
        };
        return pushNotificationService.sendPush(message);
    }
}
