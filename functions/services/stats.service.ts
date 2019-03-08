import { CollectionConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class StatsService {

    private static statsFireStoreClient = admin.firestore();
    private static FS = GeneralConstants.FORWARD_SLASH;

    /**
     * getSystemStats
     * return systemstat
     */
    static async getSystemStats(statName: string): Promise<any> {
        try {
            const systemStat = await this.statsFireStoreClient
                .doc(`${CollectionConstants.STATS}${this.FS}${statName}`)
                .get();
            return systemStat.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setSystemStats
     * return ref
     */
    static async setSystemStats(statName: string, SystemStat: any): Promise<any> {
        try {
            return await this.statsFireStoreClient
                .doc(`${CollectionConstants.STATS}${this.FS}${statName}`)
                .set(SystemStat);
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
