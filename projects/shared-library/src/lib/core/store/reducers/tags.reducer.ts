import { ActionWithPayload, TagActions } from '../actions';

export function tags(state: any = [], action: ActionWithPayload<string[]>): string[] {
  switch (action.type) {
    case TagActions.LOAD_TAGS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function topTags(state: any = [], action: ActionWithPayload<any[]>): any[] {
  switch (action.type) {
    case TagActions.LOAD_TOP_TAGS_SUCEESS:
      return action.payload;
    default:
      return state;
  }
}
