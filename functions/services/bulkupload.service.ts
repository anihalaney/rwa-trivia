import admin from '../db/firebase.client';

export class BulkUploadService {

    private static bulkUploadFireStoreClient = admin.firestore();

    /**
     * getBulkUpload
     * return bulkData
     */
    static async getBulkUpload(): Promise<any> {
        try {
            return await this.bulkUploadFireStoreClient.collection('bulk_uploads').get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * setBulkUpload
     * return ref
     */
    static async setBulkUpload(dbBulkUpload: any): Promise<any> {
        try {
            return await this.bulkUploadFireStoreClient.doc(`/bulk_uploads/${dbBulkUpload.id}`).set(dbBulkUpload);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}
