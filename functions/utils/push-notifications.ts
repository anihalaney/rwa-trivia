const pushNotificationService = require('../services/push-notification.service');
const pushNotificationUserService = require('../services/user.service');
import {
    User, Game, GameStatus, pushNotificationRouteConstants
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


    public sendGamePlayPushNotifications(data: any, currentTurnPlayerId: string, pushType: string) {
        let looserPlayerId;
        let msg_data;
        pushNotificationUserService.getUserById(currentTurnPlayerId).then((user) => {
            let dbUser: User = user.data();
            switch (pushType) {
                case pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS:
                    const game: Game = data;
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY, 'gameId': game.gameId };
                    switch (game.GameStatus) {
                        case GameStatus.WAITING_FOR_NEXT_Q:
                            this.sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} did not answer correctly. It's your turn to play!`, msg_data)
                                .then((result) => {
                                    console.log('result', result);
                                }).catch((err) => {
                                    console.log('Notification Error: ', err);
                                });
                            console.log(`${dbUser.displayName} did not answer correctly. It's your turn to play!`);
                            break;
                        case GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE:
                            this.sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} has invited you to a new game. It's your turn to play!`, msg_data)
                                .then((result) => {
                                    console.log('result', result);
                                }).catch((err) => {
                                    console.log('Notification Error: ', err);
                                });
                            console.log(`${dbUser.displayName} has invited you to a new game. It's your turn to play!`);
                            break;
                        case GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE:
                            this.sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} has invited you to a new game. It's your turn to play!`, msg_data)
                                .then((result) => {
                                    console.log('result', result);
                                }).catch((err) => {
                                    console.log('Notification Error: ', err);
                                });
                            console.log(`${dbUser.displayName} has invited you to a new game. It's your turn to play!`);
                            break;
                        case GameStatus.COMPLETED:
                            looserPlayerId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                            this.sendNotificationToDevices(looserPlayerId, 'Bitwiser Game Play',
                                `${dbUser.displayName} won the game.`, msg_data)
                                .then((result) => {
                                    console.log('result', result);
                                }).catch((err) => {
                                    console.log('Notification Error: ', err);
                                });
                            console.log(`${dbUser.displayName} won the game.`);
                            break;
                        case GameStatus.TIME_EXPIRED:
                            looserPlayerId = game.playerIds.filter((playerId) => playerId !== currentTurnPlayerId)[0];
                            this.sendNotificationToDevices(looserPlayerId, 'Bitwiser Game Play',
                                `Your time has expired. ${dbUser.displayName} has won the game.`, msg_data)
                                .then((result) => {
                                    console.log('result', result);
                                }).catch((err) => {
                                    console.log('Notification Error: ', err);
                                });
                            pushNotificationUserService.getUserById(looserPlayerId).then((userData) => {
                                dbUser = userData.data();
                                this.sendNotificationToDevices(currentTurnPlayerId, 'Bitwiser Game Play',
                                    `${dbUser.displayName} did not answer in time. You win!`, msg_data)
                                    .then((result) => {
                                        console.log('result', result);
                                    }).catch((err) => {
                                        console.log('Notification Error: ', err);
                                    });
                            });
                            console.log(`Your time has expired. ${dbUser.displayName} has won the game.`);
                            break;
                    }
                    break;

                case pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS:
                    msg_data = { 'messageType': pushNotificationRouteConstants.GAME_PLAY, 'gameId': game.gameId };
                    pushNotificationUserService
                        .sendNotificationToDevices(game.nextTurnPlayerId, 'Bitwiser Game Play',
                            'You have 32 minutes remaining to play your turn !', msg_data)
                        .then((result) => {
                            console.log('result', result);
                        }).catch((err) => {
                            console.log('Notification Error: ', err);
                        });
                    console.log(`You have 32 minutes remaining to play your turn !`);
                    break;

                case pushNotificationRouteConstants.FRIEND_NOTIFICATIONS:
                    msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };
                    pushNotificationUserService.getUserById(data.created_uid).then((userObj) => {
                        const otherUser: User = userObj.data();
                        msg_data = { 'messageType': pushNotificationRouteConstants.FRIEND_REQUEST };

                        this
                            .sendNotificationToDevices(currentTurnPlayerId, 'Friend Request',
                                `${otherUser.displayName} has sent you a friend request.`, data)
                            .then((result) => {
                                console.log('result', result);
                            }).catch((err) => {
                                console.log('Notification Error: ', err);
                            });
                        console.log(`${otherUser.displayName} has sent you a friend request.`);
                    });
                    break;

            }

        });

    }
}
