import { GameStatus } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';


export class SchedulerService {

    private static gameFireStoreClient = admin.firestore();

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
            return await this.gameFireStoreClient.collection('/games').where('gameOver', '==', false).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

}

