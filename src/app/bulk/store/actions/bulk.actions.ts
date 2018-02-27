import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { BulkUploadFileInfo } from '../../../model';

export enum BulkActionTypes {
    LOAD_BULK_UPLOAD = '[Bulk] LoadBulkUpload',
    LOAD_BULK_UPLOAD_SUCCESS = '[Bulk] LoadBulkUploadSuccess'
}

export class LoadBulkUpload implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD;
    payload = null;
}

export class LoadBulkUploadSuccess implements Action {
    readonly type = BulkActionTypes.LOAD_BULK_UPLOAD_SUCCESS;
    constructor(public payload: { bulkUploadFileInfo: BulkUploadFileInfo[] }) { }
}


export type BulkActions
    = LoadBulkUpload
    | LoadBulkUploadSuccess
