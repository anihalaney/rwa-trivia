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


    static async doGameOverOperations(): Promise<boolean> {
        try {
            const games: Game[] = await GameService.checkGameOver();
            for (const game of games) {
                const millis = Utils.getUTCTimeStamp();
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
                    (Number(game.gameOptions.opponentType) === OpponentType.Friend) ||
                    (Number(game.gameOptions.playerMode) === PlayerMode.Single)) {
                    if ((remainedTime) <= schedulerConstants.notificationInterval && game.nextTurnPlayerId) {
                        PushNotification.sendGamePlayPushNotifications(game, game.nextTurnPlayerId,
                            pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS, schedulerConstants.notificationInterval);
                    } else if (
                        ((schedulerConstants.gamePlayDuration * 60) - playedMinutes) === schedulerConstants.reminderNotificationInterval
                        && game.nextTurnPlayerId) {
                        PushNotification.sendGamePlayPushNotifications(game, game.nextTurnPlayerId,
                            pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS,
                            schedulerConstants.reminderNotificationInterval);
                    }
                }
                if (playedHours >= schedulerConstants.gamePlayDuration) {
                    GameMechanics.setGameOverParams(true, GameStatus.TIME_EXPIRED, Utils.getUTCTimeStamp(), game);
                    game.winnerPlayerId = game.playerIds.filter(playerId => playerId !== game.nextTurnPlayerId)[0];
                    if ((Number(game.gameOptions.opponentType) === OpponentType.Random) ||
                        (Number(game.gameOptions.opponentType) === OpponentType.Friend) ||
                        (Number(game.gameOptions.playerMode) === PlayerMode.Single)) {
                        PushNotification.sendGamePlayPushNotifications(game, game.winnerPlayerId,
                            pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS);
                    }
                    const dbGame = game.getDbModel();
                    if (dbGame.id) {
                        await GameService.setGame(dbGame);
                    }
                } else if (playedHours >= schedulerConstants.gameInvitationDuration
                    && (game.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE ||
                        game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE)) {
                    GameMechanics.setGameOverParams(true, GameStatus.INVITATION_TIMEOUT, Utils.getUTCTimeStamp(), game);
                    const dbGame = game.getDbModel();
                    if (dbGame.id) {
                        await GameService.setGame(dbGame);
                    }
                }
            }

            const timeStamp = Utils.getUTCTimeStamp();
            const startTime = timeStamp - (CalenderConstants.DAYS_CALCULATIONS * schedulerConstants.gamePlayLagDuration); // 32 days
            const endTime = startTime + CalenderConstants.MINUTE_CALCULATIONS; // 32 days plus one minute
            const accounts: Account[] = await AccountService.getAccountsWithLagInGamePlay(startTime, endTime);
            for (const account of accounts) {
                PushNotification.sendGamePlayPushNotifications(
                    ` - we have added new questions to bitWiser! Come back and challenge your friends to a new game.`,
                    account.id,
                    pushNotificationRouteConstants.GAME_PLAY_LAG_NOTIFICATION);
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
                        PushNotification.sendGamePlayPushNotifications(
                            ' started a new bitWiser game with you! Stay tuned for your turn!',
                            userId,
                            pushNotificationRouteConstants.NEW_GAME_START_WITH_OPPONENT, gameOptions.friendId);
                    }
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
                    if (Number(game.gameOptions.playerMode) === PlayerMode.Opponent) {
                        game.nextTurnPlayerId = game.playerIds.filter((playerId) => playerId !== game.nextTurnPlayerId)[0];
                    }
                    game.turnAt = Utils.getUTCTimeStamp();
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
