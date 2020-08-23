import { Injectable } from '@angular/core';
import { ActionWithPayload } from './action-with-payload';
import { Topic } from '../../../shared/model';

@Injectable()
export class TopicActions {

  static LOAD_TOP_TOPICS = 'LOAD_TOP_TOPICS';
  loadTopTopics(): ActionWithPayload<Topic[]> {
    return {
      type: TopicActions.LOAD_TOP_TOPICS,
      payload: null
    };
  }


  static LOAD_TOP_TOPICS_SUCCEESS = 'LOAD_TOP_TOPICS_SUCCEESS';
  loadTopTopicsSuccess(topics: any[]): ActionWithPayload<Topic[]> {
    return {
      type: TopicActions.LOAD_TOP_TOPICS_SUCCEESS,
      payload: topics
    };
  }

}
