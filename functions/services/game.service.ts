import { GameStatus } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';


export class GameService {

    private static gameFireStoreClient = admin.firestore();

    /**
     * getAvailableGames
     * return games
     */
    static async getAvailableGames(): Promise<any> {
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
    static async setGame(dbGame: any): Promise<any> {
        try {
            return await this.gameFireStoreClient.doc('/games/' + dbGame.id).set(dbGame);
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

}

