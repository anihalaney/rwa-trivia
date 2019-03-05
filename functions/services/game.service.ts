import { GameStatus, Game } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';


export class GameService {

    private static gameFireStoreClient = admin.firestore();

    /**
     * getAvailableGames
     * return games
     */
    static async getAvailableGames(): Promise<any> {
        try {
            return this.getGames(
                await this.gameFireStoreClient.collection('games').where('GameStatus', '==', GameStatus.AVAILABLE_FOR_OPPONENT)
                    .where('gameOver', '==', false)
                    .get());
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * getLiveGames
     * return games
     */
    static async getLiveGames(): Promise<any> {
        try {
            return await this.gameFireStoreClient.collection('games')
                .where('gameOver', '==', false)
                .get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * updateStats
     * return games
     */
    static async updateStats(): Promise<any> {
        try {
            const snapshot = await this.getLiveGames();
            const promises = [];
            for (const doc of snapshot.docs) {

                const game = Game.getViewModel(doc.data());
                for (const playerId of game.playerIds) {
                    game.calculateStat(playerId);
                }

                const date = new Date(new Date().toUTCString());
                game.turnAt = date.getTime() + (date.getTimezoneOffset() * 60000);

                const dbGame = game.getDbModel();
                dbGame.id = doc.id;

                promises.push(this.setGame(dbGame));
            }
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }


    /**
     * createGame
     * return ref
     */
    static async createGame(dbGame: any): Promise<any> {
        try {
            return await this.gameFireStoreClient.collection('games').add(dbGame);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * getGameById
     * return game
     */
    static async getGameById(gameId: string): Promise<any> {
        try {
            const gameData = await this.gameFireStoreClient.doc(`games/${gameId}`).get();
            if (!gameData.exists) {
                // game not found
                return;
            }
            return Game.getViewModel(gameData.data());
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * setGame
     * return ref
     */
    static async setGame(dbGame: any): Promise<any> {
        try {
            return await this.gameFireStoreClient.doc('/games/' + dbGame.id).set(dbGame);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * updateGame
     * return ref
     */
    static async updateGame(dbGame: any): Promise<any> {
        try {
            return await this.gameFireStoreClient.doc('/games/' + dbGame.id).update(dbGame);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * checkGameOver
     * return status
     */
    static async checkGameOver(): Promise<any> {
        try {
            return this.getGames(await this.gameFireStoreClient.collection('/games').where('gameOver', '==', false).get());
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * getCompletedGames
     * return games
     */
    static async getCompletedGames(): Promise<any> {
        try {
            return await this.gameFireStoreClient.collection('/games').where('gameOver', '==', true).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * getGames
     * return Game[]
     */
    static getGames(snapshots): Game[] {
        const games: Game[] = [];
        for (const snapshot of snapshots.docs) {
            games.push(Game.getViewModel(snapshot.data()));
        }
        return games;
    }

}

