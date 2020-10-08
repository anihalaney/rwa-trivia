import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot } from 'jest-marbles';
import { Actions } from '@ngrx/effects';
import { testData } from 'test/data';
import { QuestionEffects } from './question.effects';
import { QuestionService } from '../../../core/services/question.service';
import { QuestionActions } from '../actions';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RoutesRecognized } from '@angular/router';
import { Question, RouterStateUrl } from '../../../shared/model';

describe('QuestionEffects', () => {
  let effects: QuestionEffects;
  let actions$: Observable<any>;
  let questionService: any;
  const question: Question = testData.questions.published.filter(obj => obj.id === '1')[0];

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
      return response;
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

  it('Update Question', () => {

    const completion = '';
    const action = new QuestionActions().updateQuestion(question);
    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: completion });
    const expected = cold('--b', { b: completion });
    questionService.saveQuestion = jest.fn(() => response);
    expect(effects.updateQuestion$).toBeObservable(expected);
  });

  it('load first question', () => {

    const completion = new QuestionActions().getFirstQuestionSuccess(question);

    const routerState: RouterStateUrl = { url: '/first-question', queryParams: {}, params: {} };
    const event: RoutesRecognized = new RoutesRecognized(1, '/first-question', '', null);
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
      return response;
    });
    expect(effects.loadFirstQuestion$).toBeObservable(expected);
  });


  it('load first question throws Error', () => {
    const routerState: RouterStateUrl = { url: '/first-question', queryParams: {}, params: {} };
    const event: RoutesRecognized = new RoutesRecognized(1, '/first-question', '', null);
    const payload: RouterNavigationPayload<RouterStateUrl> = {
      routerState,
      event
    };
    const action: RouterNavigationAction<RouterStateUrl> = {
      type: ROUTER_NAVIGATION,
      payload
    };
    const completion = new QuestionActions().getFirstQuestionError('Error while getting Question of the day');
    const error = 'Error while getting Question of the day';


    actions$ = hot('-a---', { a: action });
    const response = cold('-#|', {}, error);
    const expected = cold('--b', { b: completion });
    questionService.getQuestionOfTheDay = jest.fn(() => response);

    expect(effects.loadFirstQuestion$).toBeObservable(expected);
  });


  it('delete Question Image', () => {
    const action = new QuestionActions().deleteQuestionImage('image.png');
    const completion = new QuestionActions().deleteQuestionImageSuccess('Image deleted successfully.');
    actions$ = hot('-a---', { a: action });
    const response = cold('-a|', { a: { message: 'Image deleted successfully.' } });
    const expected = cold('--b', { b: completion });

    questionService.deleteQuestionImage = jest.fn(() => response);

    expect(effects.deleteQuestionImage$).toBeObservable(expected);
  });


});
