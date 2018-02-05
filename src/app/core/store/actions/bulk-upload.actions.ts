import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {ActionWithPayload} from './action-with-payload';

import { BulkUploadFileInfo, User } from '../../../model';

@Injectable()
export class BulkUploadActions {

    static LOAD_BULK_UPLOAD = 'LOAD_BULK_UPLOAD';
    loadBulkUpload(): ActionWithPayload<null> {
        return {
        type: BulkUploadActions.LOAD_BULK_UPLOAD,
        payload: null
        };
    }

    static LOAD_BULK_UPLOAD_SUCCESS = 'LOAD_BULK_UPLOAD_SUCCESS';
    loadBulkUploadSuccess(bulkUploadFileInfo: BulkUploadFileInfo[]): ActionWithPayload<BulkUploadFileInfo[]> {
        return {
        type: BulkUploadActions.LOAD_BULK_UPLOAD_SUCCESS,
        payload: bulkUploadFileInfo
        };
    }

    static LOAD_USER_BULK_UPLOAD = 'LOAD_USER_BULK_UPLOAD';
    loadUserBulkUpload(user: User): ActionWithPayload<User> {
        return {
        type: BulkUploadActions.LOAD_USER_BULK_UPLOAD,
        payload: user
        };
    }

    static LOAD_USER_BULK_UPLOAD_SUCCESS = 'LOAD_USER_BULK_UPLOAD_SUCCESS';
    loadUserBulkUploadSuccess(bulkUploadFileInfo: BulkUploadFileInfo[]): ActionWithPayload<BulkUploadFileInfo[]> {
        return {
        type: BulkUploadActions.LOAD_USER_BULK_UPLOAD_SUCCESS,
        payload: bulkUploadFileInfo
        };
    }

}
