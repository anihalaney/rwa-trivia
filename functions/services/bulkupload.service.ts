import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { CollectionConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';
export class BulkUploadService {

    private static bulkUploadFireStoreClient = admin.firestore();
    /**
     * getBulkUpload
     * return bulkData
     */
    static async getBulkUpload(): Promise<any> {
        try {
            return Utils.getObjectValues(await this.bulkUploadFireStoreClient.collection(CollectionConstants.BULK_UPLOADS).get());
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setBulkUpload
     * return ref
     */
    static async setBulkUpload(dbBulkUpload: any): Promise<any> {
        try {
            return await this.bulkUploadFireStoreClient.
                doc(`${GeneralConstants.FORWARD_SLASH}${CollectionConstants.BULK_UPLOADS}${GeneralConstants.FORWARD_SLASH}${dbBulkUpload.id}`).
                set(dbBulkUpload);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
