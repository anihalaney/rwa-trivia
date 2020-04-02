import { PushNotificationService } from '../services/push-notification.service';
import { UserService } from '../services/user.service';
import {
    User, Game, GameStatus, pushNotificationRouteConstants, schedulerConstants, PlayerMode
} from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from './utils';
import { template } from 'lodash';
import { AppSettings } from './../services/app-settings.service';
export class PushNotification {

    static async sendNotificationToDevices(userId: string, title: string, body: string, data: any): Promise<any> {
        try {

            const dbUser: User = await UserService.getUserById(userId);
            const notificationPromises = [];
            if (dbUser.androidPushTokens && dbUser.androidPushTokens.length > 0) {
                for (const androidPushToken of dbUser.androidPushTokens) {
                    if (androidPushToken.token) {
                        const token = androidPushToken.token;
                        notificationPromises.push(PushNotification.sendNotification(token, title, body, data, dbUser));
                    }
                }
            }

            if (dbUser.iosPushTokens && dbUser.iosPushTokens.length > 0) {
                for (const iosPushToken of dbUser.iosPushTokens) {
                    if (iosPushToken.token) {
                        const token = iosPushToken.token;
                        notificationPromises.push(PushNotification.sendNotification(token, title, body, data, dbUser));
                    }
                }
            }

            return await Promise.all(notificationPromises)
            .catch(function(err) {
                console.log('promise failed to resolve in push notification', err);
                return notificationPromises;
            });
        } catch (error) {
            return Utils.throwError(error);
        }

    }

    static compileTemplateString (msg: string, values: {[key: string]: string}) {
        const compiled = template(msg);
        return compiled(values);
    }

    static async sendNotification(registrationToken: string, title: string, body: string, data: any, dbUser: User): Promise<String> {
        try {
            const message = {
                notification: {
                    title: title,
                    body: body
                },
                data: data,
                token: registrationToken
            };
            return await PushNotificationService.sendPush(message, dbUser);
        } catch (error) {
            return Utils.throwError(error);
        }
    }



    static async sendGamePlayPushNotifications(data: any, currentTurnPlayerId: string, pushType: string, extData?: any) {
        try {
            const appSetting = await AppSettings.Instance.getAppSettings();
            let looserPlayerId;
            let msg_data;
            let messageBody;
            //    console.log('currentTurnPlayerId----------------->', currentTurnPlayerId);
            let dbUser: User = await UserService.getUserById(currentTurnPlayerId);
            //  console.log('dbUser----------------->', dbUser);
            let result: any;
            switch (pushType) {
                case pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS:
                    if (dbUser && dbUser.displayName) {
                        const game: Game = data;
                        msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY, 'gameId': game.gameId };
                        switch (game.GameStatus) {
                            case GameStatus.WAITING_FOR_NEXT_Q:
                                if ( extData.playerAnswerId) {
                                    messageBody =  this.compileTemplateString(
                                        appSetting.notification_template.turn_change_on_wrong_answer.message,
                                        {displayName : dbUser.displayName}
                                    );
                                    result = await PushNotification.sendNotificationToDevices(
                                                        game.nextTurnPlayerId,
                                                        'bitwiser Game Play',
                                                        messageBody,
                                                        msg_data);
                                    console.log('result', result);
                                    console.log(messageBody);
                                } else {
                                    messageBody = this.compileTemplateString(
                                        appSetting.notification_template.turn_change_user_not_answered_notification_to_next_player.message,
                                        {displayName : dbUser.displayName}
                                    );
                                    result = await PushNotification.sendNotificationToDevices(
                                                        game.nextTurnPlayerId,
                                                        'bitwiser Game Play',
                                                        messageBody,
                                                        msg_data
                                                    );
                                    console.log('result', result);
                                    console.log(messageBody);

                                    const nextTurnDbUser = await UserService.getUserById(game.nextTurnPlayerId);
                                    const messageBodyCurrentUser = this.compileTemplateString(
                                        appSetting.notification_template.turn_change_notification_current_player.message,
                                        {displayName : nextTurnDbUser.displayName}
                                    );
                                    result = await PushNotification.sendNotificationToDevices(
                                                    currentTurnPlayerId,
                                                    'bitwiser Game Play',
                                                    messageBodyCurrentUser,
                                                    msg_data
                                                );
                                    console.log('result', result);
                                    console.log(messageBodyCurrentUser);
                                }
                                break;
                            case GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE:
                                messageBody = this.compileTemplateString(
                                    appSetting.notification_template.waiting_for_random_player_invitation_acceptance.message,
                                    {displayName : dbUser.displayName}
                                );
                                result = await PushNotification.sendNotificationToDevices(
                                                game.nextTurnPlayerId,
                                                'bitwiser Game Play',
                                                messageBody,
                                                msg_data
                                            );
                                console.log('result', result);
                                console.log(messageBody);
                                break;
                            case GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE:
                                messageBody = this.compileTemplateString(
                                    appSetting.notification_template.waiting_for_friend_invitation_acceptance.message,
                                    {displayName : dbUser.displayName}
                                );
                                result = await PushNotification.sendNotificationToDevices(
                                                    game.nextTurnPlayerId,
                                                    'bitwiser Game Play',
                                                    messageBody,
                                                    msg_data
                                                );
                                console.log('result', result);
                                console.log(messageBody);
                                break;
                            case GameStatus.COMPLETED:
                                messageBody = this.compileTemplateString(
                                    appSetting.notification_template.game_completed.message,
                                    {displayName : dbUser.displayName}
                                );
                                looserPlayerId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                                result = await PushNotification.sendNotificationToDevices(
                                                    looserPlayerId,
                                                    'bitwiser Game Play',
                                                    messageBody,
                                                    msg_data
                                                );
                                console.log('result', result);
                                console.log(messageBody);
                                break;
                            case GameStatus.INVITATION_TIMEOUT:
                                    messageBody = this.compileTemplateString(
                                        appSetting.notification_template.invitation_timeout.message,
                                        {displayName : dbUser.displayName}
                                    );
                                    const inviteeUserId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                                    result = await PushNotification.sendNotificationToDevices(
                                                        inviteeUserId,
                                                        'bitwiser Game Play',
                                                        messageBody,
                                                        msg_data);
                                    console.log('result', result);
                                    console.log(messageBody);
                                    break;
                            case GameStatus.TIME_EXPIRED:
                                messageBody = appSetting.notification_template.time_expired_notification_game_lost.message;
                                looserPlayerId = game.gameOptions.playerMode  == PlayerMode.Opponent ?
                                game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0] : game.nextTurnPlayerId;
                                result = await PushNotification.sendNotificationToDevices(
                                                    looserPlayerId,
                                                    'bitwiser Game Play',
                                                    messageBody,
                                                    msg_data
                                                );
                                console.log('result', result);
                                console.log(messageBody);
                            if (Number(game.gameOptions.playerMode)  === PlayerMode.Opponent) {
                                dbUser = await UserService.getUserById(looserPlayerId);
                                messageBody = this.compileTemplateString(
                                    appSetting.notification_template.time_expired_notification_game_won.message,
                                    {displayName : dbUser.displayName}
                                );
                                result = await PushNotification.sendNotificationToDevices(
                                                    currentTurnPlayerId,
                                                    'bitwiser Game Play',
                                                    messageBody,
                                                    msg_data
                                                );
                                console.log('result', result);
                                console.log(messageBody);
                            }
                                break;
                        }
                    }
                    break;

                case pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS:
                    const gameObj: Game = data;
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY, 'gameId': gameObj.gameId };
                    const userId = gameObj.nextTurnPlayerId;
                    switch ( extData ) {
                        case schedulerConstants.notificationInterval:
                            messageBody = appSetting.notification_template.game_remaining_time_notifications_32_mins.message;
                            result = await PushNotification.sendNotificationToDevices(
                                                userId,
                                                'bitwiser Game Play',
                                                messageBody,
                                                msg_data
                                            );
                            console.log('result', result);
                            console.log(messageBody);
                            break;

                        case schedulerConstants.reminderNotificationInterval:
                                let msgText = '';
                                if (gameObj.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE
                                    || gameObj.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE) {
                                        msgText = this.compileTemplateString(
                                                    appSetting.notification_template.game_invitation_remaining_time_notifications_8_hr.message,
                                                    {displayName : dbUser.displayName}
                                                  );
                                } else {
                                        msgText =  appSetting.notification_template.game_remaining_time_notifications_8_hr.message;
                                }
                                result = await PushNotification
                                .sendNotificationToDevices(userId, 'bitwiser Game Play', msgText, msg_data);
                                console.log('result', result);
                                console.log(msgText);
                                break;
                    }
                    break;


                case pushNotificationRouteConstants.FRIEND_NOTIFICATIONS:
                    msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };
                    console.log('otherUser----------------->', data.created_uid);
                    const otherUser: User = await UserService.getUserById(data.created_uid);
                    console.log('otherUser Object----------------->', otherUser);
                    msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };
                    if (otherUser && otherUser.displayName) {
                        messageBody = this.compileTemplateString(
                            appSetting.notification_template.friend_notifications.message,
                            {displayName : otherUser.displayName}
                        );
                        result = await PushNotification.sendNotificationToDevices(
                                            currentTurnPlayerId,
                                            'Friend Request',
                                            messageBody,
                                            msg_data
                                        );
                        console.log('result', result);
                        console.log(messageBody);
                    }
                    break;

                case pushNotificationRouteConstants.QUESTION_NOTIFICATIONS:
                    msg_data = { 'messageType': pushNotificationRouteConstants.QUESTION_NOTIFICATIONS };
                    result = await PushNotification
                        .sendNotificationToDevices(currentTurnPlayerId, 'Question Status Update',
                            data, msg_data);
                    console.log('result', result);
                    break;
                case pushNotificationRouteConstants.ACHIEVEMENT_NOTIFICATION:
                    messageBody = this.compileTemplateString(
                        appSetting.notification_template.achievement_notification.message,
                        {achievement : data}
                    );
                    msg_data = { 'messageType': pushNotificationRouteConstants.ACHIEVEMENT_NOTIFICATION };
                    result = await PushNotification.sendNotificationToDevices(
                                        currentTurnPlayerId,
                                        'Achievement Notification',
                                        messageBody,
                                        msg_data
                                    );
                    console.log('result', result);
                    console.log(`${msg_data} `);
                    break;
                case pushNotificationRouteConstants.NEW_GAME_START_WITH_OPPONENT:
                    messageBody = this.compileTemplateString(
                        appSetting.notification_template.new_gmae_start_with_opponent.message,
                        {displayName : dbUser.displayName}
                    );
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY };
                    result = await PushNotification.sendNotificationToDevices(
                                        extData,
                                        'bitwiser Game Play',
                                        messageBody,
                                        msg_data
                                    );
                    console.log('msg', messageBody);
                    console.log('result', result);
                    console.log(`${msg_data} `);
                    break;
                case pushNotificationRouteConstants.GAME_PLAY_LAG_NOTIFICATION:
                        messageBody =  this.compileTemplateString(
                            appSetting.notification_template.game_play_lag_notification.message,
                            {displayName : dbUser.displayName}
                        );
                        msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY };
                        result = await PushNotification.sendNotificationToDevices(
                                            currentTurnPlayerId,
                                            'bitwiser Game Play',
                                            messageBody,
                                            msg_data
                                        );
                        console.log('msg', messageBody);
                        console.log('result', result);
                        console.log(`${msg_data} `);
                        break;

            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
