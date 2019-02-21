import {
    SearchCriteria, Game, GameOperations, PlayerQnA,
    GameStatus, schedulerConstants, pushNotificationRouteConstants, OpponentType
} from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from '../utils/utils';
import { PushNotification } from '../utils/push-notifications';
import { GameMechanics } from '../utils/game-mechanics';
import { SystemStatsCalculations } from '../utils/system-stats-calculations';

import { AppSettings } from '../services/app-settings.service';
const functions = require('firebase-functions');
const gameControllerService = require('../services/game.service');
const socialGameService = require('../services/social.service');
const generalAccountService = require('../services/account.service');

const utils: Utils = new Utils();
const pushNotification: PushNotification = new PushNotification();
const fs = require('fs');
const request = require('request');
const path = require('path');
const appSettings: AppSettings = new AppSettings();

/**
 * createGame
 * return gameId
 */
exports.createGame = async (req, res) => {
    const gameOptions = req.body.gameOptions;
    const userId = req.body.userId;

    if (!gameOptions) {
        // Game Option is not added
        res.status(403).send('Game Option is not added in request');
        return;
    }

    if (!userId) {
        // userId
        res.status(403).send('userId is not added in request');
        return;
    }

    const gameMechanics: GameMechanics = new GameMechanics(gameOptions, userId);
    // Get App Settings
    const appSetting = await appSettings.getAppSettings();

    if (appSetting.lives.enable) {
        // Get Account Info
        const account = await generalAccountService.getAccountById(userId);
        // if lives is less then or equal to 0 then send with error
        if (account.data().lives <= 0) {
            res.status(403).send('Sorry, don\'t have enough life.');
            return;
        }
    }
    gameMechanics.createNewGame().then((gameId) => {
        if (appSetting.lives.enable) {
            // Decrement lives from user account
            generalAccountService.updateAccount(userId);
            // Decrement Second Player's life
            if (gameOptions.friendId) {
                generalAccountService.updateAccount(gameOptions.friendId);
            }
        }
        res.send({ gameId: gameId });
    });

};


/**
 * updateGame
 * return
 */
exports.updateGame = (req, res) => {
    const gameId = req.params.gameId;
    let dbGame = '';
    const operation = req.body.operation;

    if (!gameId) {
        // gameId
        res.status(400);
        return;
    }

    if (!operation) {
        // operation
        res.status(400);
        return;
    }
    const gameMechanics: GameMechanics = new GameMechanics(undefined, undefined);

    gameMechanics.getGameById(gameId).then((game) => {
        if (game.playerIds.indexOf(req.user.uid) === -1) {
            // operation
            res.status(403).send('Unauthorized');
            return;
        }

        const userId = req.user.uid;
        const otherPlayerUserId = game.playerIds.filter(playerId => playerId !== userId)[0];

        switch (operation) {
            case GameOperations.CALCULATE_SCORE:
                const currentPlayerQnAs: PlayerQnA = req.body.playerQnA;
                const qIndex = game.playerQnAs.findIndex((pastPlayerQnA) => pastPlayerQnA.questionId === currentPlayerQnAs.questionId);
                game.playerQnAs[qIndex] = currentPlayerQnAs;
                const currentTurnPlayerId = game.nextTurnPlayerId;
                game.decideNextTurn(currentPlayerQnAs, userId);

                if (currentPlayerQnAs.answerCorrect) {
                    generalAccountService.setBits(userId);
                }
                if (game.nextTurnPlayerId.trim().length > 0 && currentTurnPlayerId !== game.nextTurnPlayerId) {
                    pushNotification.sendGamePlayPushNotifications(game, currentTurnPlayerId,
                        pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS);
                }
                game.turnAt = utils.getUTCTimeStamp();
                game.calculateStat(currentPlayerQnAs.playerId);

                break;
            case GameOperations.GAME_OVER:
                game.gameOver = true;
                game.decideWinner();
                game.calculateStat(game.nextTurnPlayerId);
                game.GameStatus = GameStatus.COMPLETED;
                generalAccountService.setBytes(game.winnerPlayerId);
                if ((Number(game.gameOptions.opponentType) === OpponentType.Random) ||
                    (Number(game.gameOptions.opponentType) === OpponentType.Friend)) {
                    pushNotification.sendGamePlayPushNotifications(game, game.winnerPlayerId,
                        pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS);
                }
                const systemStatsCalculations: SystemStatsCalculations = new SystemStatsCalculations();
                systemStatsCalculations.updateSystemStats('game_played').then((stats) => {
                    console.log(stats);
                });
                break;
            case GameOperations.REPORT_STATUS:
                const playerQnA: PlayerQnA = req.body.playerQnA;
                const index = game.playerQnAs.findIndex(
                    playerInfo => playerInfo.questionId === playerQnA.questionId
                );
                game.playerQnAs[index] = playerQnA;
                break;
            case GameOperations.REJECT_GAME:
                game.gameOver = true;
                game.GameStatus = GameStatus.REJECTED;
                const sysStatsCalculations: SystemStatsCalculations = new SystemStatsCalculations();
                sysStatsCalculations.updateSystemStats('game_played').then((stats) => {
                    console.log(stats);
                });
                break;
            case GameOperations.UPDATE_ROUND:
                game = gameMechanics.updateRound(game, userId);
                break;
        }
        dbGame = game.getDbModel();

        gameMechanics.UpdateGame(dbGame).then((id) => {
            res.send({});
        });
    });
};


/**
 * updateAllGame
 * return status
 */
exports.updateAllGame = (req, res) => {
    gameControllerService.getLiveGames().then((snapshot) => {
        snapshot.forEach((doc) => {

            const game = Game.getViewModel(doc.data());

            game.playerIds.forEach((playerId) => {
                game.calculateStat(playerId);
            });

            const date = new Date(new Date().toUTCString());
            const millis = date.getTime() + (date.getTimezoneOffset() * 60000);
            game.turnAt = millis;

            const dbGame = game.getDbModel();
            dbGame.id = doc.id;

            gameControllerService.setGame(dbGame).then((ref) => {
            });
        });
        res.send('loaded data');


    });
};


/**
 * checkGameOver
 * return status
 */
exports.checkGameOver = (req, res) => {
    gameControllerService.checkGameOver().then((snapshot) => {
        snapshot.forEach((doc) => {
            const game: Game = Game.getViewModel(doc.data());
            const millis = utils.getUTCTimeStamp();
            const noPlayTimeBound = (millis > game.turnAt) ? millis - game.turnAt : game.turnAt - millis;
            const playedHours = Math.floor((noPlayTimeBound) / (1000 * 60 * 60));
            const playedMinutes = Math.floor((noPlayTimeBound) / (1000 * 60));

            let remainedTime;
            if (playedMinutes > schedulerConstants.beforeGameExpireDuration) {
                remainedTime = playedMinutes - schedulerConstants.beforeGameExpireDuration;
            } else {
                remainedTime = schedulerConstants.beforeGameExpireDuration - playedMinutes;
            }


            if ((Number(game.gameOptions.opponentType) === OpponentType.Random) ||
                (Number(game.gameOptions.opponentType) === OpponentType.Friend)) {
                if ((remainedTime) <= schedulerConstants.notificationInterval) {
                    pushNotification.sendGamePlayPushNotifications(game, game.nextTurnPlayerId,
                        pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS);
                }
            }


            if (playedHours >= schedulerConstants.gamePlayDuration) {
                game.gameOver = true;
                game.winnerPlayerId = game.playerIds.filter(playerId => playerId !== game.nextTurnPlayerId)[0];
                game.GameStatus = GameStatus.TIME_EXPIRED;
                if ((Number(game.gameOptions.opponentType) === OpponentType.Random) ||
                    (Number(game.gameOptions.opponentType) === OpponentType.Friend)) {
                    pushNotification.sendGamePlayPushNotifications(game, game.winnerPlayerId,
                        pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS);
                }
                const dbGame = game.getDbModel();
                gameControllerService.updateGame(dbGame).then((ref) => {
                    console.log('updated game', dbGame.id);
                });
            } else if (playedHours >= schedulerConstants.gameInvitationDuration
                && (game.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE ||
                    game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE)) {
                game.gameOver = true;
                game.GameStatus = GameStatus.INVITATION_TIMEOUT;
                const dbGame = game.getDbModel();
                gameControllerService.updateGame(dbGame).then((ref) => {
                    console.log('invitation expires', dbGame.id);
                });
            }
        });
        res.send('scheduler check is completed');
    });
};

/**
 * checkGameTurn
 * return status
 */
exports.changeGameTurn = (req, res) => {
    const gameMechanics: GameMechanics = new GameMechanics(undefined, undefined);

    gameControllerService.checkGameOver().then((snapshot) => {
        snapshot.forEach((doc) => {
            const game: Game = Game.getViewModel(doc.data());
            gameMechanics.changeTheTurn(game).then((status) => {
                console.log('game update status', status, game.gameId);
            });
        });
        res.send('scheduler check is completed');
    });
};



/**
 * createSocialContent
 * return htmlcontent
 */
exports.createSocialContent = (req, res) => {

    let websiteUrl = `https://`;

    if (functions.config().elasticsearch &&
        functions.config().elasticsearch.index &&
        functions.config().elasticsearch.index.production &&
        functions.config().elasticsearch.index.production === 'true') {
        websiteUrl += 'bitwiser.io';
    } else {
        websiteUrl += 'rwa-trivia-dev-e57fc.firebaseapp.com';
    }

    const imageUrl = `${websiteUrl}/app/game/social-image/${req.params.userId}/${req.params.socialId}`;

    const htmlContent = `<!DOCTYPE html>
                       <html>
                        <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#">
                          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=contain">
                          <meta property="og:locale" content="en_US" />
                          <meta property="og:type" content="article" />
                          <meta property="og:title" content="Bitwiser Game Score">
                          <meta property="og:description" content="Bitwiser Game Score">
                          <meta property="og:url"  content="${imageUrl}">
                          <meta property="og:image" content="${imageUrl}">
                          <meta name="twitter:card" content="summary_large_image"/>
                          <meta name="twitter:title" content="Bitwiser Game Score"/>
                          <meta name="twitter:description" content="Bitwiser Game Score">
                          <meta name="twitter:site" content="@${websiteUrl}"/>
                          <meta name="twitter:image" content="${imageUrl}"/>
                        </head>
                        <body>
                         <img src="${imageUrl}" />
                        </body>
                      </html>`;

    res.setHeader('content-type', 'text/html');
    res.send(htmlContent);
};


/**
 * createSocialImage
 * return file
 */
exports.createSocialImage = (req, res) => {
    const socialId = req.params.socialId;
    socialGameService.generateSocialUrl(req.params.userId, socialId).then((social_url) => {
        res.setHeader('content-disposition', 'attachment; filename=social_image.png');
        res.setHeader('content-type', 'image/png');
        res.send(social_url);
    });
};
