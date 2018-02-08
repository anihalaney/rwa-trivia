import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';

import { BulkUploadFileInfo, User } from '../../../model';

@Injectable()
export class BulkUploadActions {

    static LOAD_BULK_UPLOAD = 'LOAD_BULK_UPLOAD';
    static LOAD_BULK_UPLOAD_SUCCESS = 'LOAD_BULK_UPLOAD_SUCCESS';
    static LOAD_USER_BULK_UPLOAD = 'LOAD_USER_BULK_UPLOAD';
    static LOAD_USER_BULK_UPLOAD_SUCCESS = 'LOAD_USER_BULK_UPLOAD_SUCCESS';
    static LOAD_BULK_UPLOAD_BY_ID = 'LOAD_BULK_UPLOAD_BY_ID';
    static LOAD_BULK_UPLOAD_BY_ID_SUCCESS = 'LOAD_BULK_UPLOAD_BY_ID_SUCCESS';

    loadBulkUpload(): ActionWithPayload<null> {
        return {
            type: BulkUploadActions.LOAD_BULK_UPLOAD,
            payload: null
        };
    }

    loadBulkUploadSuccess(bulkUploadFileInfo: BulkUploadFileInfo[]): ActionWithPayload<BulkUploadFileInfo[]> {
        return {
            type: BulkUploadActions.LOAD_BULK_UPLOAD_SUCCESS,
            payload: bulkUploadFileInfo
        };
    }


    loadUserBulkUpload(user: User): ActionWithPayload<User> {
        return {
            type: BulkUploadActions.LOAD_USER_BULK_UPLOAD,
            payload: user
        };
    }


    loadUserBulkUploadSuccess(bulkUploadFileInfo: BulkUploadFileInfo[]): ActionWithPayload<BulkUploadFileInfo[]> {
        return {
            type: BulkUploadActions.LOAD_USER_BULK_UPLOAD_SUCCESS,
            payload: bulkUploadFileInfo
        };
    }


    loadBulkUploadById(bulkUploadFileInfo: BulkUploadFileInfo): ActionWithPayload<BulkUploadFileInfo> {
        return {
            type: BulkUploadActions.LOAD_BULK_UPLOAD_BY_ID,
            payload: bulkUploadFileInfo
        };
    }

    loadBulkUploadByIdSuccess(bulkUploadFileInfo: BulkUploadFileInfo): ActionWithPayload<BulkUploadFileInfo> {
        return {
            type: BulkUploadActions.LOAD_BULK_UPLOAD_BY_ID_SUCCESS,
            payload: bulkUploadFileInfo
        };
    }
}
