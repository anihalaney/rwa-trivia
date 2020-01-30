import { CollectionConstants, Game, GameConstants, GameStatus, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';


export class GameService {

    private static gameFireStoreClient = admin.firestore();

    /**
     * getAvailableGames
     * return games
     */
    static async getAvailableGames(): Promise<any> {
        try {
            return GameService.getGames(
                await GameService.gameFireStoreClient
                    .collection(CollectionConstants.GAMES)
                    .where(GameConstants.GAME_STATUS, GeneralConstants.DOUBLE_EQUAL, GameStatus.AVAILABLE_FOR_OPPONENT)
                    .where(GameConstants.GAME_OVER, GeneralConstants.DOUBLE_EQUAL, false)
                    .get());
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getLiveGames
     * return games
     */
    static async getLiveGames(): Promise<any> {
        try {
            return await GameService.gameFireStoreClient.collection(CollectionConstants.GAMES)
                .where(GameConstants.GAME_OVER, GeneralConstants.DOUBLE_EQUAL, false)
                .get();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * updateStats
     * return games
     */
    static async updateStats(): Promise<any> {
        try {
            const snapshot = await GameService.getLiveGames();
            const promises = [];
            for (const doc of snapshot.docs) {

                const game = Game.getViewModel(doc.data());
                for (const playerId of game.playerIds) {
                    game.calculateStat(playerId);
                }

                const date = new Date(new Date().toUTCString());
                game.reminder8Hr = false;
                game.reminder32Min = false;
                game.turnAt = date.getTime() + (date.getTimezoneOffset() * 60000);

                const dbGame = game.getDbModel();
                dbGame.id = doc.id;

                promises.push(GameService.setGame(dbGame));
            }
            return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * createGame
     * return ref
     */
    static async createGame(dbGame: any): Promise<any> {
        try {
            return await GameService.gameFireStoreClient.collection(CollectionConstants.GAMES).add(dbGame);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getGameById
     * return game
     */
    static async getGameById(gameId: string): Promise<any> {
        try {
            const gameData = await GameService.gameFireStoreClient
                .doc(`${CollectionConstants.GAMES}/${gameId}`)
                .get();
            if (!gameData.exists) {
                // game not found
                return;
            }
            const game = gameData.data();
            game['id'] = (game['id']) ? game['id'] : gameData['id'];
            return Game.getViewModel(game);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setGame
     * return ref
     */
    static async setGame(dbGame: any): Promise<any> {
        try {
            return await GameService.gameFireStoreClient
                .doc(`/${CollectionConstants.GAMES}/${dbGame.id}`)
                .set(dbGame, { merge: true });
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * getCompletedGames
     * return games
     */
    static async getCompletedGames(): Promise<any> {
        try {
            return GameService.getGames(
                await GameService.gameFireStoreClient
                    .collection(`/${CollectionConstants.GAMES}`)
                    .where(GameConstants.GAME_OVER, GeneralConstants.DOUBLE_EQUAL, true)
                    .get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * updateGame
     * return ref
     */
    static async updateGame(dbGame: any): Promise<any> {
        try {
            return await GameService.gameFireStoreClient
                .doc(`/${CollectionConstants.GAMES}/${dbGame.id}`)
                .set(dbGame, { merge: true });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * checkGameOver
     * return status
     */
    static async checkGameOver(): Promise<any> {
        try {
            return GameService.getGames(
                await GameService.gameFireStoreClient
                    .collection(`/${CollectionConstants.GAMES}`)
                    .where(GameConstants.GAME_OVER, GeneralConstants.DOUBLE_EQUAL, false)
                    .get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getAllGameForReminder
     * return status
     */
    static async getAllGameForReminder(timeStamp: number, type: string, gameStatus = []): Promise<any> {
        try {
            if (gameStatus.length > 0) {
                return GameService.getGames(
                    await GameService.gameFireStoreClient
                        .collection(`/${CollectionConstants.GAMES}`)
                        .where(GameConstants.GAME_OVER, GeneralConstants.DOUBLE_EQUAL, false)
                        .where(GameConstants.TURN_AT, GeneralConstants.LESS_THAN_OR_EQUAL, timeStamp)
                        .where(type, GeneralConstants.DOUBLE_EQUAL, false)
                        .where(GameConstants.GAME_STATUS, GeneralConstants.IN, gameStatus)
                        .get()
                    );
            } else {
                return GameService.getGames(
                    await GameService.gameFireStoreClient
                        .collection(`/${CollectionConstants.GAMES}`)
                        .where(GameConstants.GAME_OVER, GeneralConstants.DOUBLE_EQUAL, false)
                        .where(GameConstants.TURN_AT, GeneralConstants.LESS_THAN_OR_EQUAL, timeStamp)
                        .where(type, GeneralConstants.DOUBLE_EQUAL, false)
                        .get()
                    );
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * GetAllExpiredGames
     * return status
     */
    static async getAllExpiredGames(timeStamp: number, gameStatus: string[]): Promise<any> {
        try {
            return GameService.getGames(
                await GameService.gameFireStoreClient
                    .collection(`/${CollectionConstants.GAMES}`)
                    .where(GameConstants.GAME_OVER, GeneralConstants.DOUBLE_EQUAL, false)
                    .where(GameConstants.GAME_STATUS , GeneralConstants.IN , gameStatus)
                    .where(GameConstants.TURN_AT, GeneralConstants.LESS_THAN_OR_EQUAL, timeStamp)
                    .get()
                );
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getGames
     * return Game[]
     */
    static getGames(snapshots: any): Game[] {
        const games: Game[] = [];
        for (const snapshot of snapshots.docs) {
            games.push(Game.getViewModel(snapshot.data()));
        }
        return games;
    }

}

