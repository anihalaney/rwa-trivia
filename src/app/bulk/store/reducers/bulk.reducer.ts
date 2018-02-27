import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { User } from '../../../model';
import { BulkActions, BulkActionTypes } from '../actions';
import { BulkUploadFileInfo } from '../../../model';

export function bulkUploadFileInfos(state: any = [], action: BulkActions): BulkUploadFileInfo[] {
    switch (action.type) {
        case BulkActionTypes.LOAD_BULK_UPLOAD_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}
