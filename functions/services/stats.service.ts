import admin from '../db/firebase.client';
const statsFireStoreClient = admin.firestore();

export class StatsService {

    /**
     * getSystemStats
     * return systemstat
     */
    static async getSystemStats(statName: string): Promise<any> {
        try {
            return await statsFireStoreClient.doc(`stats/${statName}`).get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * setSystemStats
     * return ref
     */
    static async setSystemStats(statName: string, SystemStat: any): Promise<any> {
        try {
            return await statsFireStoreClient.doc(`stats/${statName}`).set(SystemStat);
        } catch (error) {
            console.error(error);
            throw error;
        }

    };
}

