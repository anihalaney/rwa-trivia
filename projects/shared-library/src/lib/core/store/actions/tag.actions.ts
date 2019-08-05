import { Injectable } from '@angular/core';
import { ActionWithPayload } from './action-with-payload';

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

  static LOAD_TOP_TAGS = 'LOAD_TOP_TAGS';
  loadTopTags(): ActionWithPayload<any[]> {
    return {
      type: TagActions.LOAD_TOP_TAGS,
      payload: null
    };
  }


  static LOAD_TOP_TAGS_SUCEESS = 'LOAD_TOP_TAGS_SUCEESS';
  loadTopTagsSuccess(categories: any[]): ActionWithPayload<any[]> {
    return {
      type: TagActions.LOAD_TOP_TAGS_SUCEESS,
      payload: categories
    };
  }

}
