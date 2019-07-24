import { PushNotificationService } from '../services/push-notification.service';
import { UserService } from '../services/user.service';
import {
    User, Game, GameStatus, pushNotificationRouteConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from './utils';

export class PushNotification {


    static async sendNotificationToDevices(userId: string, title: string, body: string, data: any): Promise<any> {
        try {
          //  console.log('next PlayerId ----------------->', userId);
            const dbUser: User = await UserService.getUserById(userId);
          //  console.log('next dbUser----------------->', dbUser);
            const notificationPromises = [];
            if (dbUser.androidPushTokens && dbUser.androidPushTokens.length > 0) {
                for (const androidPushToken of dbUser.androidPushTokens) {
                    notificationPromises.push(PushNotification.sendNotification(androidPushToken.token, title, body, data, dbUser));
                }
            }

            if (dbUser.iosPushTokens && dbUser.iosPushTokens.length > 0) {
                for (const iosPushToken of dbUser.iosPushTokens) {
                    notificationPromises.push(PushNotification.sendNotification(iosPushToken.token, title, body, data, dbUser));
                }
            }

            return await Promise.all(notificationPromises);
        } catch (error) {
            return Utils.throwError(error);
        }

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



    static async sendGamePlayPushNotifications(data: any, currentTurnPlayerId: string, pushType: string) {
        try {
            let looserPlayerId;
            let msg_data;
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
                                result = await PushNotification.sendNotificationToDevices(game.nextTurnPlayerId, 'bitwiser Game Play',
                                    `${dbUser.displayName} did not answer correctly. It's your turn to play!`, msg_data);
                                console.log('result', result);
                                console.log(`${dbUser.displayName} did not answer correctly. It's your turn to play!`);
                                break;
                            case GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE:
                                result = await PushNotification.sendNotificationToDevices(game.nextTurnPlayerId, 'bitwiser Game Play',
                                    `${dbUser.displayName} has invited you to a new game. It's your turn to play!`, msg_data);
                                console.log('result', result);
                                console.log(`${dbUser.displayName} has invited you to a new game. It's your turn to play!`);
                                break;
                            case GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE:
                                result = await PushNotification.sendNotificationToDevices(game.nextTurnPlayerId, 'bitwiser Game Play',
                                    `${dbUser.displayName} has invited you to a new game. It's your turn to play!`, msg_data);
                                console.log('result', result);
                                console.log(`${dbUser.displayName} has invited you to a new game. It's your turn to play!`);
                                break;
                            case GameStatus.COMPLETED:
                                looserPlayerId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                                result = await PushNotification.sendNotificationToDevices(looserPlayerId, 'bitwiser Game Play',
                                    `${dbUser.displayName} won the game.`, msg_data);
                                console.log('result', result);
                                console.log(`${dbUser.displayName} won the game.`);
                                break;
                            case GameStatus.TIME_EXPIRED:
                                looserPlayerId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                                result = await PushNotification.sendNotificationToDevices(looserPlayerId, 'bitwiser Game Play',
                                    `Your time has expired. ${dbUser.displayName} has won the game.`, msg_data);
                                console.log('result', result);
                                dbUser = await UserService.getUserById(looserPlayerId);
                                result = await PushNotification.sendNotificationToDevices(currentTurnPlayerId, 'bitwiser Game Play',
                                    `${dbUser.displayName} did not answer in time. You win!`, msg_data);
                                console.log('result', result);
                                console.log(`Your time has expired. ${dbUser.displayName} has won the game.`);
                                break;
                        }
                    }
                    break;

                case pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS:
                    const gameObj: Game = data;
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY, 'gameId': gameObj.gameId };
                    result = await PushNotification
                        .sendNotificationToDevices(gameObj.nextTurnPlayerId, 'bitwiser Game Play',
                            'You have 32 minutes remaining to play your turn !', msg_data);
                    console.log('result', result);
                    console.log(`You have 32 minutes remaining to play your turn !`);
                    break;

                case pushNotificationRouteConstants.FRIEND_NOTIFICATIONS:
                    msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };
                    console.log('otherUser----------------->', data.created_uid);
                    const otherUser: User = await UserService.getUserById(data.created_uid);
                    console.log('otherUser Object----------------->', otherUser);
                    msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };
                    if (otherUser && otherUser.displayName) {
                        result = await PushNotification
                            .sendNotificationToDevices(currentTurnPlayerId, 'Friend Request',
                                `${otherUser.displayName} has sent you a friend request.`, data);
                        console.log('result', result);
                        console.log(`${otherUser.displayName} has sent you a friend request.`);
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
                    msg_data = { 'messageType': pushNotificationRouteConstants.ACHIEVEMENT_NOTIFICATION };
                    result = await PushNotification
                        .sendNotificationToDevices(currentTurnPlayerId, 'Achievement Notification',
                            data, msg_data);
                    console.log('result', result);
                    console.log(`${msg_data} `);
                    break;

            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
