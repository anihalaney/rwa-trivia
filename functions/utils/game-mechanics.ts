import { Game, GameStatus, GameOptions, PlayerMode, OpponentType } from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from './utils';

import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';
import { SchedulerService } from '../services/scheduler.service';

export class GameMechanics {


    private static gameOptions: GameOptions;
    private static userId: string;


    static async createNewGame(userId: string, gameOptions: GameOptions): Promise<string> {
        this.userId = userId;
        this.gameOptions = gameOptions;

        try {
            await this.updateUser(userId, gameOptions);

            if (Number(gameOptions.playerMode) === PlayerMode.Opponent) {
                if (gameOptions.rematch) {
                    return await this.createFriendUserGame(gameOptions.friendId, GameStatus.RESTARTED);
                } else {
                    if (Number(gameOptions.opponentType) === OpponentType.Random) {
                        return await this.joinGame();
                    } else if (Number(gameOptions.opponentType) === OpponentType.Friend) {
                        return await this.createFriendUserGame(gameOptions.friendId, GameStatus.STARTED);
                    }
                }
            } else {
                return (gameOptions.rematch) ?
                    await this.createSingleAndRandomUserGame(GameStatus.RESTARTED) :
                    await this.createSingleAndRandomUserGame(GameStatus.STARTED);
            }
        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }


    private static async joinGame(): Promise<string> {
        try {
            const games = await GameService.getAvailableGames();

            const gameArr = [];

            games.forEach(game => {
                gameArr.push(Game.getViewModel(game.data()));
            });

            const totalGames = gameArr.length;
            if (totalGames > 0) {
                return this.pickRandomGame(gameArr, totalGames);
            } else {
                return await this.createSingleAndRandomUserGame(GameStatus.STARTED);
            }
        } catch (error) {
            console.error('Error : ');
            throw error;
        }
    }

    private static async pickRandomGame(queriedItems: Array<Game>, totalGames: number): Promise<string> {

        const randomGameNo = Math.floor(Math.random() * totalGames);
        const game = queriedItems[randomGameNo];

        try {
            if (game.playerIds[0] !== this.userId && game.nextTurnPlayerId === '') {
                game.nextTurnPlayerId = this.userId;
                game.GameStatus = GameStatus.JOINED_GAME;
                game.addPlayer(this.userId);
                game.playerIds.map((playerId) => {
                    game.calculateStat(playerId);
                });

                const dbGame = game.getDbModel();
                //   console.log('dbGame', dbGame);
                return await this.setGame(dbGame);
            } else if (totalGames === 1) {
                return await this.createSingleAndRandomUserGame(GameStatus.STARTED);
            } else {
                totalGames--;
                queriedItems.splice(randomGameNo, 1);
                return await this.pickRandomGame(queriedItems, totalGames);
            }
        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }


    private static async createSingleAndRandomUserGame(gameStatus): Promise<string> {
        const timestamp = Utils.getUTCTimeStamp();
        try {
            const game = new Game(this.gameOptions, this.userId, undefined, undefined, false, this.userId, undefined, undefined,
                gameStatus, timestamp, timestamp);
            return await this.createGame(game);
        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }

    private static async createFriendUserGame(friendId: string, gameStatus): Promise<string> {
        const timestamp = Utils.getUTCTimeStamp();
        try {
            const game = new Game(this.gameOptions, this.userId, undefined, undefined, false, this.userId, friendId, undefined,
                gameStatus, timestamp, timestamp);
            return await this.createGame(game);
        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }


    private static async createGame(game: Game): Promise<string> {
        game.generateDefaultStat();
        const dbGame = game.getDbModel(); // object to be saved
        try {
            const ref = await GameService.createGame(dbGame);
            dbGame.id = ref.id;
            return await this.setGame(dbGame);
        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }

    static async getGameById(gameId: string): Promise<Game> {
        try {
            const game = await GameService.getGameById(gameId);
            return Game.getViewModel(game.data());
        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }

    static async setGame(dbGame: any): Promise<string> {
        // Use the set method of the doc instead of the add method on the collection,
        // so the id field of the data matches the id of the document
        try {
            await GameService.setGame(dbGame);
            return dbGame.id;
        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }

    static async UpdateGame(dbGame: any): Promise<string> {
        // Use the set method of the doc instead of the add method on the collection,
        // so the id field of the data matches the id of the document
        try {
            await SchedulerService.updateGame(dbGame);
            return dbGame.id;
        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }


    static async changeTheTurn(game: Game): Promise<boolean> {


        console.log('playerQuestions---->', game.playerQnAs);

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
                    const dbGame = game.getDbModel();
                    console.log('change the turn ---->', dbGame);
                    await this.UpdateGame(dbGame);
                    return false;
                } else {
                    return Promise.resolve(true);
                }
            } else {
                return Promise.resolve(true);
            }
        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }

    static updateRound(game: Game, userId: string): Game {
        if (game.playerQnAs.length > 0) {
            game.round = (game.round) ? game.round : game.stats[userId]['round'];
            const otherPlayerUserId = game.playerIds.filter(playerId => playerId !== userId)[0];
            const currentUserQuestions = game.playerQnAs.filter((pastPlayerQnA) =>
                pastPlayerQnA.playerId === userId);
            const otherUserQuestions = game.playerQnAs.filter((pastPlayerQnA) => pastPlayerQnA.playerId === otherPlayerUserId
            );
            if (Number(game.gameOptions.playerMode) === PlayerMode.Opponent &&
                currentUserQuestions.length > 0 && otherUserQuestions.length > 0) {
                const lastcurrentUserQuestion = currentUserQuestions[currentUserQuestions.length - 1];
                const lastotherUserQuestions = otherUserQuestions[otherUserQuestions.length - 1];
                lastcurrentUserQuestion.round = (lastcurrentUserQuestion.round) ? lastcurrentUserQuestion.round : game.round;
                lastotherUserQuestions.round = (lastotherUserQuestions.round) ? lastotherUserQuestions.round : game.round;
                if (lastcurrentUserQuestion.round === lastotherUserQuestions.round
                    && !lastcurrentUserQuestion.answerCorrect
                    && !lastotherUserQuestions.answerCorrect) {
                    game.round = game.round + 1;
                }
            }
        }
        return game;
    }

    // Add lastGamePlayOption when new game create
    private static async updateUser(userId: string, gameOptions: any): Promise<string> {
        try {
            const user = await UserService.getUserById(userId);

            const dbUser = user.data();
            dbUser.lastGamePlayOption = gameOptions;

            await UserService.updateUser(dbUser);
            return dbUser.userId;

        } catch (error) {
            console.error('Error : ' + error);
            throw error;
        }
    }
}
