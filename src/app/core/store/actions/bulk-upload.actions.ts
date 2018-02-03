import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {ActionWithPayload} from './action-with-payload';

import { BulkUploadFileInfo } from '../../../model';

@Injectable()
export class BulkUploadActions {

    static LOAD_FILE_RECORD = 'LOAD_FILE_RECORD';
    loadFileRecord(): ActionWithPayload<null> {
        return {
        type: BulkUploadActions.LOAD_FILE_RECORD,
        payload: null
        };
    }

    static LOAD_FILE_RECORD_SUCCESS = 'LOAD_FILE_RECORD_SUCCESS';
    loadFileRecordSuccess(bulkUploadFileInfo: BulkUploadFileInfo[]): ActionWithPayload<BulkUploadFileInfo[]> {
        return {
        type: BulkUploadActions.LOAD_FILE_RECORD_SUCCESS,
        payload: bulkUploadFileInfo
        };
    }

}
