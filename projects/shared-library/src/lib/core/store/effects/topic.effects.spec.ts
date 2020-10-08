import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot } from 'jest-marbles';
import { Actions } from '@ngrx/effects';
import { testData } from 'test/data';
import { TopicEffects } from './topic.effects';
import { TopicService } from '../../../core/services';
import { TopicActions } from '../actions';

describe('TopicEffects', () => {
    let effects: TopicEffects;
    let actions$: Observable<any>;
    let topicService: any;


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                TopicActions,
                TopicEffects,
                {
                    provide: TopicService,
                    useValue: { getTopTopics: jest.fn() }
                },
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(TopicEffects);
        topicService = TestBed.get(TopicService);
        actions$ = TestBed.get(Actions);
    });

    it('load top topic', () => {
        const topTopics = testData.topTopics;
        const action = new TopicActions().loadTopTopics();
        const completion = new TopicActions().loadTopTopicsSuccess(topTopics);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: topTopics });
        const expected = cold('--b', { b: completion });
        topicService.getTopTopics = jest.fn(() => response);
        expect(effects.getTopTopics$).toBeObservable(expected);
    });

});