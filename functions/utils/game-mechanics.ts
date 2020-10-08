import {
    Game, GameOperations, GameOptions, GameStatus,
    OpponentType, PlayerMode, PlayerQnA,
    pushNotificationRouteConstants, schedulerConstants, User, GeneralConstants, CalenderConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';
import { PushNotification } from '../utils/push-notifications';
import { Utils } from './utils';

export class GameMechanics {

    static async doGameOperations(userId: string, playerQnA: PlayerQnA, game: Game, operation: string): Promise<boolean> {
        try {
            switch (operation) {
                case GameOperations.CALCULATE_SCORE:
                    const qIndex = game.playerQnAs.findIndex((pastPlayerQnA) => pastPlayerQnA.questionId === playerQnA.questionId);
                    game.playerQnAs[qIndex] = playerQnA;
                    const currentTurnPlayerId = game.nextTurnPlayerId;
                    game.decideNextTurn(playerQnA, userId);

                    if (game.nextTurnPlayerId && game.nextTurnPlayerId.trim().length > 0 && currentTurnPlayerId !== game.nextTurnPlayerId) {
                        console.log('CALCULATE_SCORE----------->', currentTurnPlayerId);
                        console.log('CALCULATE_SCORE  game----------->', game);
                        PushNotification.sendGamePlayPushNotifications(game, currentTurnPlayerId,
                            pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS, playerQnA);
                    }
                    game.reminder32Min = false;
                    game.reminder8Hr = false;
                    game.turnAt = Utils.getUTCTimeStamp();
                    game.calculateStat(playerQnA.playerId);

                    break;
                case GameOperations.GAME_OVER:
                    GameMechanics.setGameOverParams(true, GameStatus.COMPLETED, Utils.getUTCTimeStamp(), game);
                    game.decideWinner();
                    game.calculateStat(game.nextTurnPlayerId);
                    if (game.winnerPlayerId) {
                        AccountService.setBytes(game.winnerPlayerId);
                    }
                    if (game.gameOptions.opponentType !== null && ((Number(game.gameOptions.opponentType) === OpponentType.Random) ||
                        (Number(game.gameOptions.opponentType) === OpponentType.Friend))) {
                        PushNotification.sendGamePlayPushNotifications(game, game.winnerPlayerId,
                            pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS);
                    }
                    break;
                case GameOperations.REPORT_STATUS:
                    const index = game.playerQnAs.findIndex(
                        playerInfo => playerInfo.questionId === playerQnA.questionId
                    );
                    game.playerQnAs[index] = playerQnA;
                    break;
                case GameOperations.REJECT_GAME:
                    GameMechanics.setGameOverParams(true, GameStatus.REJECTED, Utils.getUTCTimeStamp(), game);
                    break;
                case GameOperations.UPDATE_ROUND:
                    game = GameMechanics.updateRound(game, userId);
                    break;
            }
            await GameService.setGame(game.getDbModel());
            return true;
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    static async checkGameExpiredAndSetGameOver(): Promise<boolean> {
        try {
            const millis = Utils.getUTCTimeStamp();
            const noPlayTime = (CalenderConstants.HOURS_CALCULATIONS * schedulerConstants.gamePlayLagDuration);
            const playedHoursTimeStamp = millis - noPlayTime;
            const games: Game[] = await GameService.getAllExpiredGames(playedHoursTimeStamp,
                [GameStatus.STARTED, GameStatus.RESTARTED, GameStatus.WAITING_FOR_NEXT_Q,
                GameStatus.AVAILABLE_FOR_OPPONENT, GameStatus.JOINED_GAME]);
                for (const game of games) {
                    if (game.gameId) {
                    GameMechanics.setGameOverParams(true, GameStatus.TIME_EXPIRED, Utils.getUTCTimeStamp(), game);
                    game.winnerPlayerId = game.playerIds.filter(playerId => playerId !== game.nextTurnPlayerId)[0];
                    if ((Number(game.gameOptions.opponentType) === OpponentType.Random) ||
                        (Number(game.gameOptions.opponentType) === OpponentType.Friend) ||
                        (Number(game.gameOptions.playerMode) === PlayerMode.Single)) {
                        PushNotification.sendGamePlayPushNotifications(game,
                           game.gameOptions.playerMode  == PlayerMode.Opponent ? game.winnerPlayerId  : game.nextTurnPlayerId,
                            pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS);
                    }
                    const dbGame = game.getDbModel();
                    if (dbGame.id) {
                        await GameService.setGame(dbGame);
                    }
                    }
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    static async checkGameInvitationIsExpired(): Promise<boolean> {
        try {
            const millis = Utils.getUTCTimeStamp();
            const noPlayTime = (CalenderConstants.HOURS_CALCULATIONS * schedulerConstants.gameInvitationDuration);
            const playedHoursTimeStamp = millis - noPlayTime;
            const games: Game[] = await GameService.getAllExpiredGames(playedHoursTimeStamp,
                [GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE, GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE]);
                for (const game of games) {
                if (game.gameId) {
                    GameMechanics.setGameOverParams(true, GameStatus.INVITATION_TIMEOUT, Utils.getUTCTimeStamp(), game);

                    PushNotification.sendGamePlayPushNotifications(game, game.nextTurnPlayerId,
                         pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS);
                    const dbGame = game.getDbModel();
                    if (dbGame.id) {
                        await GameService.setGame(dbGame);
                    }
                }
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async doSendGameReminderNotification(timeBefore: number): Promise<boolean> {
        try {
            let reminderInterval = '';
            let gameStatus = [];
            if (timeBefore === schedulerConstants.notificationInterval) {
                reminderInterval = 'reminder32Min';
                gameStatus = [GameStatus.STARTED, GameStatus.RESTARTED, GameStatus.WAITING_FOR_NEXT_Q,
                    GameStatus.AVAILABLE_FOR_OPPONENT, GameStatus.JOINED_GAME];
            } else if (timeBefore === schedulerConstants.reminderNotificationInterval) {
                reminderInterval = 'reminder8Hr';
                gameStatus = [];
            } else {
                return true;
            }

            const millis = Utils.getUTCTimeStamp();
            const noPlayTime = (CalenderConstants.HOURS_CALCULATIONS * schedulerConstants.gamePlayLagDuration);
            const notificationDuration = millis - ( noPlayTime -  (timeBefore * 60 * 1000));
            const games: Game[] = await GameService.getAllGameForReminder(notificationDuration, reminderInterval, gameStatus);
            for (const game of games) {
                if (game.gameId) {
                    PushNotification.sendGamePlayPushNotifications(game,
                        game.playerIds.filter((playerId) => playerId !== game.nextTurnPlayerId)[0],
                    pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS, timeBefore);
                    game[reminderInterval] = true;
                    const dbGame = game.getDbModel();
                    if (dbGame.id) {
                        await GameService.setGame(dbGame);
                    }
                }
            }
            return true;

        } catch (error) {
            return Utils.throwError(error);
        }
    }


    static async doSendGameNotPlayedNotification(): Promise<boolean>  {
        try {
            const timeStamp = Utils.getUTCTimeStamp();
            const startTime = timeStamp - (CalenderConstants.DAYS_CALCULATIONS * schedulerConstants.gamePlayLagDuration); // 32 days
            const accounts = await AccountService.getAccountsWithLagInGamePlay(startTime);
            for (const account of accounts) {
                PushNotification.sendGamePlayPushNotifications(
                    '',
                    account.id,
                    pushNotificationRouteConstants.GAME_PLAY_LAG_NOTIFICATION);
                    account.lastGamePlayedNotification = true;
                    await AccountService.updateAccountData(account);
            }
            return true;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async createNewGame(userId: string, gameOptions: GameOptions): Promise<string> {
        let gameId;
        try {
            await GameMechanics.updateUser(userId, gameOptions);

            if (Number(gameOptions.playerMode) === PlayerMode.Opponent) {
                if (gameOptions.rematch) {
                    gameId = await GameMechanics.createFriendUserGame(gameOptions.friendId, GameStatus.RESTARTED, userId, gameOptions);
                } else {
                    if (Number(gameOptions.opponentType) === OpponentType.Random) {
                        gameId = await GameMechanics.joinGame(userId, gameOptions);
                    } else if (Number(gameOptions.opponentType) === OpponentType.Friend) {
                        gameId = await GameMechanics.createFriendUserGame(gameOptions.friendId, GameStatus.STARTED, userId, gameOptions);
                    }
                }

                if ((Number(gameOptions.opponentType) === OpponentType.Random ||
                Number(gameOptions.opponentType) === OpponentType.Friend) && gameOptions.friendId && gameOptions.friendId !== '') {
                    PushNotification.sendGamePlayPushNotifications(
                        '',
                        userId,
                        pushNotificationRouteConstants.NEW_GAME_START_WITH_OPPONENT, gameOptions.friendId);
                }
            } else {
                gameId = (gameOptions.rematch) ?
                    await GameMechanics.createSingleAndRandomUserGame(GameStatus.RESTARTED, userId, gameOptions) :
                    await GameMechanics.createSingleAndRandomUserGame(GameStatus.STARTED, userId, gameOptions);
            }
            return gameId;
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    private static async joinGame(userId: string, gameOptions: GameOptions): Promise<string> {
        try {
            const games: Game[] = await GameService.getAvailableGames();
            const totalGames = games.length;

            if (totalGames > 0) {
                return GameMechanics.pickRandomGame(games, totalGames, userId, gameOptions);
            } else {
                return await GameMechanics.createSingleAndRandomUserGame(GameStatus.STARTED, userId, gameOptions);
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static async pickRandomGame(queriedItems: Array<Game>, totalGames: number,
        userId: string, gameOptions: GameOptions): Promise<string> {

        const randomGameNo = Math.floor(Math.random() * totalGames);
        const game = queriedItems[randomGameNo];

        try {
            if (game.playerIds[0] !== userId && game.nextTurnPlayerId === '') {
                game.nextTurnPlayerId = userId;
                game.GameStatus = GameStatus.JOINED_GAME;
                game.addPlayer(userId);

                for (const playerId of game.playerIds) {
                    game.calculateStat(playerId);
                }

                const dbGame = game.getDbModel();
                return await GameMechanics.setGame(dbGame);
            } else if (totalGames === 1) {
                return await GameMechanics.createSingleAndRandomUserGame(GameStatus.STARTED, userId, gameOptions);
            } else {
                totalGames--;
                queriedItems.splice(randomGameNo, 1);
                return await GameMechanics.pickRandomGame(queriedItems, totalGames, userId, gameOptions);
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    private static async createSingleAndRandomUserGame(gameStatus, userId: string, gameOptions: GameOptions): Promise<string> {
        const timestamp = Utils.getUTCTimeStamp();
        try {
            const game = new Game(gameOptions, userId, undefined, undefined, false, userId, undefined, undefined,
                gameStatus, timestamp, timestamp);
            return await GameMechanics.createGame(game);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static async createFriendUserGame(friendId: string, gameStatus, userId: string, gameOptions: GameOptions): Promise<string> {
        const timestamp = Utils.getUTCTimeStamp();
        try {
            const game = new Game(gameOptions, userId, undefined, undefined, false, userId, friendId, undefined,
                gameStatus, timestamp, timestamp);
            return await GameMechanics.createGame(game);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    private static async createGame(game: Game): Promise<string> {
        game.generateDefaultStat();
        const dbGame = game.getDbModel(); // object to be saved
        try {
            const ref = await GameService.createGame(dbGame);
            dbGame.id = ref.id;
            return await GameMechanics.setGame(dbGame);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async setGame(dbGame: any): Promise<string> {
        // Use the set method of the doc instead of the add method on the collection,
        // so the id field of the data matches the id of the document
        try {
            await GameService.setGame(dbGame);
            return dbGame.id;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async changeTheTurn(game: Game): Promise<boolean> {
        try {
            if (game.playerQnAs.length > 0) {
                const index = game.playerQnAs.length - 1;
                const lastAddedQuestion = game.playerQnAs[index];

                if (!lastAddedQuestion.playerAnswerInSeconds && lastAddedQuestion.playerAnswerInSeconds !== 0) {
                    lastAddedQuestion.playerAnswerId = null;
                    lastAddedQuestion.answerCorrect = false;
                    lastAddedQuestion.playerAnswerInSeconds = 16;
                    game.playerQnAs[index] = lastAddedQuestion;
                    const currentTurnPlayerId = game.nextTurnPlayerId;
                    if (Number(game.gameOptions.playerMode) === PlayerMode.Opponent) {
                        game.nextTurnPlayerId = game.playerIds.filter((playerId) => playerId !== game.nextTurnPlayerId)[0];
                    }
                    game.reminder32Min = false;
                    game.reminder8Hr = false;
                    game.turnAt = Utils.getUTCTimeStamp();
                    PushNotification.sendGamePlayPushNotifications(game, currentTurnPlayerId,
                        pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS, lastAddedQuestion);
                    game.calculateStat(lastAddedQuestion.playerId);
                    await GameService.setGame(game.getDbModel());
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static updateRound(game: Game, userId: string): Game {
        if (game.playerQnAs.length > 0) {
            game.round = (game.round) ? game.round : game.stats[userId][GeneralConstants.ROUND];
            const otherPlayerUserId = game.playerIds.filter(playerId => playerId !== userId)[0];
            const currentUserQuestions = game.playerQnAs.filter((pastPlayerQnA) =>
                pastPlayerQnA.playerId === userId);
            const otherUserQuestions = game.playerQnAs.filter((pastPlayerQnA) => pastPlayerQnA.playerId === otherPlayerUserId
            );
            if (Number(game.gameOptions.playerMode) === PlayerMode.Opponent &&
                currentUserQuestions.length > 0 && otherUserQuestions.length > 0) {
                const lastCurrentUserQuestion = currentUserQuestions[currentUserQuestions.length - 1];
                const lastOtherUserQuestions = otherUserQuestions[otherUserQuestions.length - 1];
                lastCurrentUserQuestion.round = (lastCurrentUserQuestion.round) ? lastCurrentUserQuestion.round : game.round;
                lastOtherUserQuestions.round = (lastOtherUserQuestions.round) ? lastOtherUserQuestions.round : game.round;
                if (lastCurrentUserQuestion.round === lastOtherUserQuestions.round
                    && !lastCurrentUserQuestion.answerCorrect
                    && !lastOtherUserQuestions.answerCorrect) {
                    game.round = Utils.changeFieldValue(1);
                }
            }
        }
        return game;
    }

    // Add lastGamePlayOption when new game create
    private static async updateUser(userId: string, gameOptions: any): Promise<string> {
        try {
            const dbUser: User = await UserService.getUserById(userId);
            dbUser.lastGamePlayOption = gameOptions;

            await UserService.updateUser(dbUser);
            return dbUser.userId;

        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static setGameOverParams(gameOver: boolean, gameStatus: string, gameOverAt: number, game: Game) {
        game.gameOver = gameOver;
        game.GameStatus = gameStatus;
        game.gameOverAt = gameOverAt;
    }

}
