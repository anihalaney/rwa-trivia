import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { ActionWithPayload, TopicActions } from '../actions';
import { Topic } from '../../../shared/model';

export function topics(state: any = [], action: ActionWithPayload<Topic[]>): Topic[] {
  switch (action.type) {
    case TopicActions.LOAD_TOPICS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

//selectors
export const getTopicsDictionary = (state: Topic[]) => {
  return state.reduce((result, topic) => {
    result[topic.id] = topic;
    return result;
  }, {});
};

export function topTopics(state: any = [], action: ActionWithPayload<any[]>): Topic[] {
  switch (action.type) {
    case TopicActions.LOAD_TOP_TOPICS_SUCEESS:
      return action.payload;
    default:
      return state;
  }
}
