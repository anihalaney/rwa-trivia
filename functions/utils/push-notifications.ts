import { PushNotificationService } from '../services/push-notification.service';
import { UserService } from '../services/user.service';
import {
    User, Game, GameStatus, pushNotificationRouteConstants, schedulerConstants, PlayerMode
} from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from './utils';

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
                                if ( extData.playerAnswerId) {
                                    result = await PushNotification.sendNotificationToDevices(game.nextTurnPlayerId, 'bitwiser Game Play',
                                        `${dbUser.displayName} did not answer correctly. It's your turn now!!`, msg_data);
                                    console.log('result', result);
                                    console.log(`${dbUser.displayName} did not answer correctly. It's your turn now!!`);
                                } else {
                                    result = await PushNotification.sendNotificationToDevices(game.nextTurnPlayerId, 'bitwiser Game Play',
                                        `${dbUser.displayName} did not answer in time. It’s your turn to play and win bitWiser!`, msg_data);
                                    console.log('result', result);
                                    console.log(`${dbUser.displayName} did not answer in time. It’s your turn to play and win bitWiser!`);

                                    const nextTurnDbUser = await UserService.getUserById(game.nextTurnPlayerId);
                                    result = await PushNotification.sendNotificationToDevices(currentTurnPlayerId, 'bitwiser Game Play',
                                    `${nextTurnDbUser.displayName}’s turn to play bitWiser.`, msg_data);
                                    console.log('result', result);
                                    console.log(`${nextTurnDbUser.displayName}’s turn to play bitWiser.`);
                                }
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
                                    `${dbUser.displayName} won this bitWiser game. Play again, to get even!`, msg_data);
                                console.log('result', result);
                                console.log(`${dbUser.displayName} won this bitWiser game. Play again, to get even!`);
                                break;
                            case GameStatus.INVITATION_TIMEOUT:
                                    const inviteeUserId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                                    result = await PushNotification.sendNotificationToDevices(inviteeUserId, 'bitwiser Game Play',
                                        `Your game play invitation to ${dbUser.displayName} expired. Challenge your friends to a new game!`, msg_data);
                                    console.log('result', result);
                                    console.log(`Your game play invitation to ${dbUser.displayName} expired. Challenge your friends to a new game!`);
                                    break;
                            case GameStatus.TIME_EXPIRED:
                                looserPlayerId = game.gameOptions.playerMode  == PlayerMode.Opponent ?
                                game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0] : game.nextTurnPlayerId;
                                result = await PushNotification.sendNotificationToDevices(looserPlayerId, 'bitwiser Game Play',
                                `You snooze you lose! sorry, your bitWiser game ended. Take another shot now!`,
                                msg_data);
                                console.log('result', result);
                                console.log(`You snooze you lose! sorry, your bitWiser game ended. Take another shot now!`);
                            if (Number(game.gameOptions.playerMode)  === PlayerMode.Opponent) {
                                dbUser = await UserService.getUserById(looserPlayerId);
                                result = await PushNotification.sendNotificationToDevices(currentTurnPlayerId, 'bitwiser Game Play',
                                `${dbUser.displayName} did not answer in time. You have won this bitWiser game! You are on a roll, start another game.`,
                                msg_data);
                                console.log('result', result);
                                console.log(`${dbUser.displayName} did not answer in time. You have won this bitWiser game! You are on a roll, start another game.`);
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
                            result = await PushNotification
                            .sendNotificationToDevices(userId, 'bitwiser Game Play',
                                'You have only 32 minutes left to be a bitWiser! Play now!', msg_data);
                            console.log('result', result);
                            console.log(`You have only 32 minutes left to be a bitWiser! Play now!`);
                            break;

                        case schedulerConstants.reminderNotificationInterval:
                                let msgText = '';
                                if (gameObj.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE
                                    || gameObj.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE) {
                                        msgText =
                                        `Your game play invitation from ${dbUser.displayName} will expire in 8 hours. Accept the challenge and play now!`;
                                } else {
                                        msgText = 'Your bitWiser game will expire in 8 hours, play now!';
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
                        result = await PushNotification
                            .sendNotificationToDevices(currentTurnPlayerId, 'Friend Request',
                            `${otherUser.displayName}  wants to friend you on bitWiser! Accept or Deny. Let the bitWiser battles begin!`,
                             msg_data);
                        console.log('result', result);
                        console.log(
                            `${otherUser.displayName}  wants to friend you on bitWiser! Accept or Deny. Let the bitWiser battles begin!`);
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
                case pushNotificationRouteConstants.NEW_GAME_START_WITH_OPPONENT:
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY };
                    result = await PushNotification
                        .sendNotificationToDevices(extData, 'bitwiser Game Play',
                            `${dbUser.displayName}${data}`, msg_data);
                    console.log('msg', `${dbUser.displayName}${data}`);
                    console.log('result', result);
                    console.log(`${msg_data} `);
                    break;
                case pushNotificationRouteConstants.GAME_PLAY_LAG_NOTIFICATION:
                        msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY };
                        result = await PushNotification
                            .sendNotificationToDevices(currentTurnPlayerId, 'bitwiser Game Play',
                                `${dbUser.displayName}${data}`, msg_data);
                        console.log('msg', `${dbUser.displayName}${data}`);
                        console.log('result', result);
                        console.log(`${msg_data} `);
                        break;

            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
