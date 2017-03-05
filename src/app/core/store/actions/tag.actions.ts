import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

@Injectable()
export class TagActions {

  static LOAD_TAGS = 'LOAD_TAGS';
  loadTags(): Action {
    return {
      type: TagActions.LOAD_TAGS
    };
  }

  static LOAD_TAGS_SUCCESS = 'LOAD_TAGS_SUCCESS';
  loadTagsSuccess(tags: string[]): Action {
    return {
      type: TagActions.LOAD_TAGS_SUCCESS,
      payload: tags
    };
  }

}
