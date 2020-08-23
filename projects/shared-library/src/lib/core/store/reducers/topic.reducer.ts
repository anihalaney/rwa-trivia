import { ActionWithPayload, TopicActions } from '../actions';
import { Topic } from '../../../shared/model';

export function topTopics(state: any = [], action: ActionWithPayload<any[]>): Topic[] {
  switch (action.type) {
    case TopicActions.LOAD_TOP_TOPICS_SUCCEESS:
      return action.payload;
    default:
      return state;
  }
}
