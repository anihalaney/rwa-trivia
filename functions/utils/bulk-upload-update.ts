const leaderBoardUserService = require('../services/user.service');
const bulkUploadUserService = require('../services/bulkupload.service');

import { User, BulkUploadFileInfo } from '../../src/app/model';

export class BulkUploadUpdate {
    getUserList() {
        const userObs: { [key: string]: any } = {};
        return leaderBoardUserService.getUsers().then(users => {
            users.docs.map(user => {
                const userObj: User = user.data();
                if (userObj.roles) {
                    userObs[userObj.userId] = userObj.roles;
                }
            });
            return bulkUploadUserService.getBulkUpload().then(bulkData => {
                bulkData.docs.map((bulkUploadFileInfo, index) => {
                    const bulkObj: BulkUploadFileInfo = bulkUploadFileInfo.data();
                    if (userObs[bulkObj.created_uid]) {
                        if (userObs[bulkObj.created_uid].admin) {
                            bulkObj['isAdminArchived'] = false;
                        } else {
                            bulkObj['isUserArchived'] = false;
                        }
                        bulkUploadUserService.setBulkUpload(bulkObj).then(ref => {
                            return bulkObj.id;
                        });
                    }
                });

            })
        });
    }
}
