import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { CollectionConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';
export class BulkUploadService {

    private static bulkUploadFireStoreClient = admin.firestore();
    private static FS = GeneralConstants.FORWARD_SLASH;
    private static BS = CollectionConstants.BULK_UPLOADS;

    /**
     * getBulkUpload
     * return bulkData
     */
    static async getBulkUpload(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(
                await BulkUploadService.bulkUploadFireStoreClient
                    .collection(BulkUploadService.BS)
                    .get()
            );
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
            return await BulkUploadService.bulkUploadFireStoreClient.
                doc(`${BulkUploadService.FS}${CollectionConstants.BULK_UPLOADS}${BulkUploadService.FS}${dbBulkUpload.id}`).
                set(dbBulkUpload);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
