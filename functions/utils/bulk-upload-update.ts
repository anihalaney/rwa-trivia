const bulkUploadUserService = require('../services/bulkupload.service');

import { User, BulkUploadFileInfo } from '../../projects/shared-library/src/lib/shared/model';

export class BulkUploadUpdate {
    getUserList() {
        return bulkUploadUserService.getBulkUpload().then(bulkData => {
            bulkData.docs.map((bulkUploadFileInfo, index) => {
                const bulkObj: BulkUploadFileInfo = bulkUploadFileInfo.data();
                bulkObj['isAdminArchived'] = false;
                bulkObj['isUserArchived'] = false;
                bulkUploadUserService.setBulkUpload(bulkObj).then(ref => {
                    return bulkObj.id;
                });
            });
        })
    }
}
