import { Observable } from 'rxjs/Observable';
import {Action} from '@ngrx/store';

import { ActionWithPayload,  BulkUploadActions  } from '../actions';
import { BulkUploadFileInfo } from '../../../model';

  export function bulkUploadFileInfo(state: any = [], action: ActionWithPayload<BulkUploadFileInfo[]>): BulkUploadFileInfo[] {
    switch (action.type) {
      case BulkUploadActions.LOAD_FILE_RECORD_SUCCESS:
        return action.payload;
      default:
        return state;
    }
  }