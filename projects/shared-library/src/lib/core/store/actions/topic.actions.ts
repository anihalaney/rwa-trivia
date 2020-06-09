import { Injectable } from '@angular/core';
import { ActionWithPayload } from './action-with-payload';
import { Topic } from '../../../shared/model';

@Injectable()
export class TopicActions {

  static LOAD_TOP_TOPICS = 'LOAD_TOP_TOPICS';
  static LOAD_TOP_TOPICS_SUCEESS = 'LOAD_TOP_TOPICS_SUCEESS';

  loadTopTopics(): ActionWithPayload<Topic[]> {
    return {
      type: TopicActions.LOAD_TOP_TOPICS,
      payload: null
    };
  }

  loadTopTopicsSuccess(topics: any[]): ActionWithPayload<Topic[]> {
    return {
      type: TopicActions.LOAD_TOP_TOPICS_SUCEESS,
      payload: topics
    };
  }

}
