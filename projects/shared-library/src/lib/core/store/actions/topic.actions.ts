import { Injectable } from '@angular/core';
import { ActionWithPayload } from './action-with-payload';
import { Topic } from '../../../shared/model';

@Injectable()
export class TopicActions {

  static LOAD_TOPIC = 'LOAD_TOPIC';
  loadTopics(): ActionWithPayload<null> {
    return {
      type: TopicActions.LOAD_TOPIC,
      payload: null
    };
  }

  static LOAD_TOPICS_SUCCESS = 'LOAD_TOPICS_SUCCESS';
  loadTopicsSuccess(topics: Topic[]): ActionWithPayload<Topic[]> {
    return {
      type: TopicActions.LOAD_TOPICS_SUCCESS,
      payload: topics
    };
  }

  static LOAD_TOP_TOPICS = 'LOAD_TOP_TOPICS';
  loadTopTopics(): ActionWithPayload<any[]> {
    return {
      type: TopicActions.LOAD_TOP_TOPICS,
      payload: null
    };
  }

  
  static LOAD_TOP_TOPICS_SUCEESS = 'LOAD_TOP_TOPICS_SUCEESS';
  loadTopTopicsSuccess(topics: any[]): ActionWithPayload<any[]> {
    return {
      type: TopicActions.LOAD_TOP_TOPICS_SUCEESS,
      payload: topics
    };
  }

}
