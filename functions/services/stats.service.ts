import admin from '../db/firebase.client';

export class StatsService {
    private static statsFireStoreClient = admin.firestore();
    /**
     * getSystemStats
     * return systemstat
     */
    static async getSystemStats(statName: string): Promise<any> {
        try {
            return await this.statsFireStoreClient.doc(`stats/${statName}`).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * setSystemStats
     * return ref
     */
    static async setSystemStats(statName: string, SystemStat: any): Promise<any> {
        try {
            return await this.statsFireStoreClient.doc(`stats/${statName}`).set(SystemStat);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }

    }
}
