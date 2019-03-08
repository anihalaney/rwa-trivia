import { BulkUploadFileInfo, BulkUploadConstants } from '../../projects/shared-library/src/lib/shared/model';
import { BulkUploadService } from '../services/bulkupload.service';
import { Utils } from '../utils/utils';

export class BulkUploadUpdate {

    static async getUserList(): Promise<any> {
        try {
            const bulkUploadFileInfos: BulkUploadFileInfo[] = await BulkUploadService.getBulkUpload();
            const promises = [];
            for (const bulkUploadFileInfo of bulkUploadFileInfos) {
                bulkUploadFileInfo[BulkUploadConstants.IS_ADMIN_ARCHIVED] = false;
                bulkUploadFileInfo[BulkUploadConstants.IS_USER_ARCHIVED] = false;
                promises.push(BulkUploadService.setBulkUpload(bulkUploadFileInfo));
            }
            return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
