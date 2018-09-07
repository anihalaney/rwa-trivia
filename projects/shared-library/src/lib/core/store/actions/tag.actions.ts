import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {ActionWithPayload} from './action-with-payload';

@Injectable()
export class TagActions {

  static LOAD_TAGS = 'LOAD_TAGS';
  loadTags(): ActionWithPayload<null> {
    return {
      type: TagActions.LOAD_TAGS,
      payload: null
    };
  }

  static LOAD_TAGS_SUCCESS = 'LOAD_TAGS_SUCCESS';
  loadTagsSuccess(tags: string[]): ActionWithPayload<string[]> {
    return {
      type: TagActions.LOAD_TAGS_SUCCESS,
      payload: tags
    };
  }

}
