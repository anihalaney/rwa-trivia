import { GameStatus } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';


export class GameService {

    static gameFireStoreClient = admin.firestore();

    /**
     * getAvailableGames
     * return games
     */
    public static async getAvailableGames(): Promise<any> {
        try {
            return await this.gameFireStoreClient.collection('games').where('GameStatus', '==', GameStatus.AVAILABLE_FOR_OPPONENT)
                .where('gameOver', '==', false)
                .get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * getLiveGames
     * return games
     */
    public static async getLiveGames(): Promise<any> {
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
     * createGame
     * return ref
     */
    public static async createGame(dbGame: any): Promise<any> {
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
    public static async getGameById(gameId: string): Promise<any> {
        try {
            return await this.gameFireStoreClient.doc(`games/${gameId}`).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * setGame
     * return ref
     */
    public static async setGame(dbGame: any): Promise<any> {
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
    public static async updateGame(dbGame: any): Promise<any> {
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
    public static async checkGameOver(): Promise<any> {
        try {
            return await this.gameFireStoreClient.collection('/games').where('gameOver', '==', false).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * getCompletedGames
     * return games
     */
    public static async getCompletedGames(): Promise<any> {
        try {
            return await this.gameFireStoreClient.collection('/games').where('gameOver', '==', true).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

}

