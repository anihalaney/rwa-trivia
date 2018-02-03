import { Observable } from 'rxjs/Observable';
import {Action} from '@ngrx/store';

import { ActionWithPayload,  FileSummaryActions,  } from '../actions';
import { FileTrack } from '../../../model';


export function fileTrack(state: any = [], action: ActionWithPayload<FileTrack[]>): FileTrack[] {
    switch (action.type) {
      case FileSummaryActions.LOAD_FILE_RECORD_SUCCESS:
        console.log(action.payload);
        return action.payload;
      default:
        return state;
    }
  };