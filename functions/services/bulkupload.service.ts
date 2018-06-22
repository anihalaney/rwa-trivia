const bulkUploadFireBaseClient = require('../db/firebase-client');
const bulkUploadFireStoreClient = bulkUploadFireBaseClient.firestore();

/**
 * getBulkUpload
 * return bulkData
 */
exports.getBulkUpload = (): Promise<any> => {
    return bulkUploadFireStoreClient.collection('bulk_uploads')
        .get().then(bulkData => { return bulkData })
        .catch(error => {
            console.error(error);
            return error;
        });
};

/**
 * setBulkUpload
 * return ref
 */
exports.setBulkUpload = (dbBulkUpload: any): Promise<any> => {
    return bulkUploadFireStoreClient.doc(`/bulk_uploads/${dbBulkUpload.id}`).set(dbBulkUpload).then(ref => { return ref })
        .catch(error => {
            console.error(error);
            return error;
        });
};
