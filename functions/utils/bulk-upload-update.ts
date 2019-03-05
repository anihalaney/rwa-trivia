import { BulkUploadFileInfo } from '../../projects/shared-library/src/lib/shared/model';
import { BulkUploadService } from '../services/bulkupload.service';

export class BulkUploadUpdate {

    static async getUserList(): Promise<any> {
        try {
            const bulkData = await BulkUploadService.getBulkUpload();
            const promises = [];
            for (const bulkUploadFileInfo of bulkData.docs) {
                const bulkObj: BulkUploadFileInfo = bulkUploadFileInfo.data();
                bulkObj['isAdminArchived'] = false;
                bulkObj['isUserArchived'] = false;
                promises.push(BulkUploadService.setBulkUpload(bulkObj));
            }
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

}
