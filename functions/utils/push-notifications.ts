const pushNotificationService = require('../services/push-notification.service');
import { UserService } from '../services/user.service';

import {
    User, Game, GameStatus, pushNotificationRouteConstants
} from '../../projects/shared-library/src/lib/shared/model';


export class PushNotification {
    pushNotificationUserService: UserService;

    constructor() {
        this.pushNotificationUserService = new UserService();
    }

    async sendNotificationToDevices(userId: string, title: string, body: string, data: any): Promise<any> {
        try {
            const user = await UserService.getUserById(userId);
            const dbUser: User = user.data();
            const notificationPromises = [];
            if (dbUser.androidPushTokens) {
                for (const token of dbUser.androidPushTokens) {
                    notificationPromises.push(this.sendNotification(token, title, body, data));
                }
            }

            if (dbUser.iosPushTokens) {
                for (const tokenIo of dbUser.iosPushTokens) {
                    notificationPromises.push(this.sendNotification(tokenIo, title, body, data));
                }
            }

            return await Promise.all(notificationPromises);
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    sendNotification(registrationToken: string, title: string, body: string, data: any): Promise<String> {
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


    async sendGamePlayPushNotifications(data: any, currentTurnPlayerId: string, pushType: string) {
        try {
            let looserPlayerId;
            let msg_data;
            const user = await UserService.getUserById(currentTurnPlayerId);
            let result: any;
            let dbUser: User = user.data();
            switch (pushType) {
                case pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS:
                    const game: Game = data;
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY, 'gameId': game.gameId };
                    switch (game.GameStatus) {
                        case GameStatus.WAITING_FOR_NEXT_Q:
                            result = await this.sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} did not answer correctly. It's your turn to play!`, msg_data);
                                console.log('result', result);
                                console.log(`${dbUser.displayName} did not answer correctly. It's your turn to play!`);
                            break;
                        case GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE:
                            result = await this.sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} has invited you to a new game. It's your turn to play!`, msg_data);
                            console.log('result', result);
                            console.log(`${dbUser.displayName} has invited you to a new game. It's your turn to play!`);
                            break;
                        case GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE:
                            result = await this.sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} has invited you to a new game. It's your turn to play!`, msg_data);
                            console.log('result', result);
                            console.log(`${dbUser.displayName} has invited you to a new game. It's your turn to play!`);
                            break;
                        case GameStatus.COMPLETED:
                            looserPlayerId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                            result = await this.sendNotificationToDevices(looserPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} won the game.`, msg_data);
                            console.log('result', result);
                            console.log(`${dbUser.displayName} won the game.`);
                            break;
                        case GameStatus.TIME_EXPIRED:
                            looserPlayerId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                            result = await this.sendNotificationToDevices(looserPlayerId, 'Bitwiser Game Play',
                            `Your time has expired. ${dbUser.displayName} has won the game.`, msg_data);
                            console.log('result', result);
                            const userData = await UserService.getUserById(looserPlayerId);
                            dbUser = userData.data();
                            result = await this.sendNotificationToDevices(currentTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} did not answer in time. You win!`, msg_data);
                            console.log('result', result);
                            console.log(`Your time has expired. ${dbUser.displayName} has won the game.`);
                            break;
                    }
                    break;

                case pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS:
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY, 'gameId': game.gameId };
                    result = await this
                        .sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                            'You have 32 minutes remaining to play your turn !', msg_data);
                        console.log('result', result);
                        console.log(`You have 32 minutes remaining to play your turn !`);
                    break;

                case pushNotificationRouteConstants.FRIEND_NOTIFICATIONS:
                    msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };
                    const userObj = await UserService.getUserById(data.created_uid);
                        const otherUser: User = userObj.data();
                        msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };

                        result = await this
                            .sendNotificationToDevices(currentTurnPlayerId, 'Friend Request',
                                `${otherUser.displayName} has sent you a friend request.`, data);
                        console.log('result', result);
                        console.log(`${otherUser.displayName} has sent you a friend request.`);
                    break;

            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
