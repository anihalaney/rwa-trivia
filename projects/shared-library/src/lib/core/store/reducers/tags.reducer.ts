import { Observable } from 'rxjs';
import {Action} from '@ngrx/store';

import { ActionWithPayload, TagActions } from '../actions';

export function tags(state: any = [], action: ActionWithPayload<string[]>): string[] {
  switch (action.type) {
    case TagActions.LOAD_TAGS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};
