const bulkUploadUserService = require('../services/bulkupload.service');

import { User, BulkUploadFileInfo } from '../../projects/shared-library/src/lib/shared/model';

export class BulkUploadUpdate {
    getUserList = async (): Promise<any> => {
        try {
            const bulkData = await bulkUploadUserService.getBulkUpload();
            for (const bulkUploadFileInfo of bulkData.docs) {
                const bulkObj: BulkUploadFileInfo = bulkUploadFileInfo.data();
                bulkObj['isAdminArchived'] = false;
                bulkObj['isUserArchived'] = false;
                const ref = await bulkUploadUserService.setBulkUpload(bulkObj);
                if (ref) {
                    return bulkObj.id;
                } else {
                    return;
                }
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
