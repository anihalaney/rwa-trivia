import { PushNotificationService } from '../services/push-notification.service';
import { UserService } from '../services/user.service';
import {
    User, Game, GameStatus, pushNotificationRouteConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from './utils';

export class PushNotification {


    static async sendNotificationToDevices(userId: string, title: string, body: string, data: any): Promise<any> {
        try {
            const dbUser: User = await UserService.getUserById(userId);
            const notificationPromises = [];
            if (dbUser.androidPushTokens) {
                for (const token of dbUser.androidPushTokens) {
                    notificationPromises.push(PushNotification.sendNotification(token, title, body, data));
                }
            }

            if (dbUser.iosPushTokens) {
                for (const token of dbUser.iosPushTokens) {
                    notificationPromises.push(PushNotification.sendNotification(token, title, body, data));
                }
            }

            return await Promise.all(notificationPromises);
        } catch (error) {
            return Utils.throwError(error);
        }

    }

    static sendNotification(registrationToken: string, title: string, body: string, data: any): Promise<String> {
        const message = {
            notification: {
                title: title,
                body: body
            },
            data: data,
            token: registrationToken
        };
        return PushNotificationService.sendPush(message);
    }


    static async sendGamePlayPushNotifications(data: any, currentTurnPlayerId: string, pushType: string) {
        try {
            let looserPlayerId;
            let msg_data;
            let dbUser: User = await UserService.getUserById(currentTurnPlayerId);
            let result: any;
            switch (pushType) {
                case pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS:
                    const game: Game = data;
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY, 'gameId': game.gameId };
                    switch (game.GameStatus) {
                        case GameStatus.WAITING_FOR_NEXT_Q:
                            result = await PushNotification.sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} did not answer correctly. It's your turn to play!`, msg_data);
                            console.log('result', result);
                            console.log(`${dbUser.displayName} did not answer correctly. It's your turn to play!`);
                            break;
                        case GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE:
                            result = await PushNotification.sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} has invited you to a new game. It's your turn to play!`, msg_data);
                            console.log('result', result);
                            console.log(`${dbUser.displayName} has invited you to a new game. It's your turn to play!`);
                            break;
                        case GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE:
                            result = await PushNotification.sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} has invited you to a new game. It's your turn to play!`, msg_data);
                            console.log('result', result);
                            console.log(`${dbUser.displayName} has invited you to a new game. It's your turn to play!`);
                            break;
                        case GameStatus.COMPLETED:
                            looserPlayerId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                            result = await PushNotification.sendNotificationToDevices(looserPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} won the game.`, msg_data);
                            console.log('result', result);
                            console.log(`${dbUser.displayName} won the game.`);
                            break;
                        case GameStatus.TIME_EXPIRED:
                            looserPlayerId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                            result = await PushNotification.sendNotificationToDevices(looserPlayerId, 'Bitwiser Game Play',
                                `Your time has expired. ${dbUser.displayName} has won the game.`, msg_data);
                            console.log('result', result);
                            dbUser = await UserService.getUserById(looserPlayerId);
                            result = await PushNotification.sendNotificationToDevices(currentTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} did not answer in time. You win!`, msg_data);
                            console.log('result', result);
                            console.log(`Your time has expired. ${dbUser.displayName} has won the game.`);
                            break;
                    }
                    break;

                case pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS:
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY, 'gameId': game.gameId };
                    result = await PushNotification
                        .sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                            'You have 32 minutes remaining to play your turn !', msg_data);
                    console.log('result', result);
                    console.log(`You have 32 minutes remaining to play your turn !`);
                    break;

                case pushNotificationRouteConstants.FRIEND_NOTIFICATIONS:
                    msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };
                    const otherUser: User = await UserService.getUserById(data.created_uid);
                    msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };

                    result = await PushNotification
                        .sendNotificationToDevices(currentTurnPlayerId, 'Friend Request',
                            `${otherUser.displayName} has sent you a friend request.`, data);
                    console.log('result', result);
                    console.log(`${otherUser.displayName} has sent you a friend request.`);
                    break;

            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
