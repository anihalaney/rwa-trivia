import { Observable } from 'rxjs/Observable';
import {Action} from '@ngrx/store';

import { ActionWithPayload,  BulkUploadActions  } from '../actions';
import { BulkUploadFileInfo } from '../../../model';

  export function bulkUploadFileInfos(state: any = [], action: ActionWithPayload<BulkUploadFileInfo[]>): BulkUploadFileInfo[] {
    switch (action.type) {
      case BulkUploadActions.LOAD_BULK_UPLOAD_SUCCESS:
        return action.payload;
      default:
        return state;
    }
  }

  export function userBulkUploadFileInfos(state: any = [], action: ActionWithPayload<BulkUploadFileInfo[]>): BulkUploadFileInfo[] {
    switch (action.type) {
      case BulkUploadActions.LOAD_BULK_UPLOAD_SUCCESS:
        return action.payload;
      default:
        return state;
    }
  }

