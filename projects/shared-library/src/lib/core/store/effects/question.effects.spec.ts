import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { Actions } from '@ngrx/effects';
import { TEST_DATA } from '../../../testing/test.data';
import { QuestionEffects } from './question.effects';
import { QuestionService } from '../../../core/services/question.service';
import { QuestionActions } from '../actions';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RoutesRecognized } from '@angular/router';
import { Question, RouterStateUrl } from '../../../shared/model';


describe('Effects: QuestionEffects', () => {
    let effects: QuestionEffects;
    let actions$: Observable<any>;
    let questionService: any;
    const question: Question = TEST_DATA.questions.published.filter(obj => { return obj.id === '1' })[0];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                QuestionActions,
                QuestionEffects,
                {
                    provide: QuestionService,
                    useValue: { getQuestionOfTheDay: jest.fn() }
                },
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(QuestionEffects);
        questionService = TestBed.get(QuestionService);
        actions$ = TestBed.get(Actions);
    });

    it('load question of the day', () => {
        const completion = new QuestionActions().getQuestionOfTheDaySuccess(question);

        // not sure this best way to emulate it, this can be converted into utility function
        // here to test effect which use router navigation action we are manually mocking it
        // this by pass ngrx route-store and  router all together and only test effect
        const routerState: RouterStateUrl = { url: '/dashboard', queryParams: {}, params: {} };
        const event: RoutesRecognized = new RoutesRecognized(1, '/dashboard', '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };
        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: question });
        const expected = cold('--b', { b: completion });
        questionService.getQuestionOfTheDay = jest.fn(() => {
            console.log('mocked getQuestionOfTheDay');
            return response
        });
        expect(effects.loadRouteQuestionOfDay$).toBeObservable(expected);
    });

    it('load question of the day throws Error', () => {
        const routerState: RouterStateUrl = { url: '/dashboard', queryParams: {}, params: {} };
        const event: RoutesRecognized = new RoutesRecognized(1, '/dashboard', '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };
        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };
        const completion = new QuestionActions().getQuestionOfTheDayError('Error while getting Question of the day');
        const error = 'Error while getting Question of the day';


        actions$ = hot('-a---', { a: action });
        const response = cold('-#|', {}, error);
        const expected = cold('--b', { b: completion });
        questionService.getQuestionOfTheDay = jest.fn(() => response);

        expect(effects.loadRouteQuestionOfDay$).toBeObservable(expected);
    });

    it('load next question', () => {
        const action = new QuestionActions().getQuestionOfTheDay();
        const completion = new QuestionActions().getQuestionOfTheDaySuccess(question);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: question });
        const expected = cold('--b', { b: completion });

        questionService.getQuestionOfTheDay = jest.fn(() => response);

        expect(effects.loadNextQuestionOfDay$).toBeObservable(expected);
    });

    it('load next question throws Error', () => {
        const action = new QuestionActions().getQuestionOfTheDay();
        const completion = new QuestionActions().getQuestionOfTheDayError('Error while getting next Question of the day');
        const error = 'Error while getting next Question of the day';
        actions$ = hot('-a---', { a: action });
        const response = cold('-#|', {}, error);
        const expected = cold('--b', { b: completion });
        questionService.getQuestionOfTheDay = jest.fn(() => response);

        expect(effects.loadNextQuestionOfDay$).toBeObservable(expected);
    });
});
