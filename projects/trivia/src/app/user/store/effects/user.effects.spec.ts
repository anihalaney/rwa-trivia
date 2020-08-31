import { Observable } from 'rxjs';
import { QuestionService } from 'shared-library/core/services';
import { TestBed, async } from '@angular/core/testing';
import * as UserActions from '../actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jest-marbles';
import { testData } from 'test/data';
import { User, RouterStateUrl, Question } from 'shared-library/shared/model';
import { UserEffects } from './user.effects';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState } from 'shared-library/core/store';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RoutesRecognized } from '@angular/router';


describe('UserEffects:', () => {
    let effects: UserEffects;
    let actions$: Observable<any>;
    let questionService: QuestionService;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const user: User = testData.userList[0];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({})],
            providers: [
                {
                    provide: QuestionService,
                    useValue: {}
                },

                UserEffects,
                provideMockStore({
                    initialState: { 'core': { user } },
                    selectors: [
                        {
                            selector: coreState,
                            value: { user }
                        }
                    ]
                }),
                provideMockActions(() => actions$),
            ],
        });
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, { user });
        effects = TestBed.get(UserEffects);
        questionService = TestBed.get(QuestionService);
        actions$ = TestBed.get(Actions);
        mockStore.refreshState();
    }));

    it('addQuestion', () => {
        const question: Question = testData.questions.published.filter(obj => obj.id === '1')[0];
        const completion = '';
        const action = new UserActions.AddQuestion({ question });
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: completion });
        const expected = cold('--b', { b: completion });
        questionService.saveQuestion = jest.fn(() => response);
        expect(effects.addQuestion$).toBeObservable(expected);
    });

    // loadUserUnpublishedQuestions
    it('loadUserUnpublishedQuestions', () => {
        const unpublishedQuestions = testData.questions.unpublished;
        const routerState: RouterStateUrl = { url: `/user/my/questions`, queryParams: {}, params: {} };
        const event: RoutesRecognized = new RoutesRecognized(1, `/user/my/questions`, '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };

        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };

        const completion = new UserActions.LoadUserUnpublishedQuestionsSuccess(unpublishedQuestions);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: unpublishedQuestions });
        const expected = cold('--b', { b: completion });
        questionService.getUserQuestions = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserUnpublishedQuestions$).toBeObservable(expected);
    });


    // loadUserPublishedRouteQuestions
    it('loadUserPublishedRouteQuestions', () => {
        const publishedQuestions = testData.questions.published;
        const routerState: RouterStateUrl = { url: `/user/my/questions`, queryParams: {}, params: {} };
        const event: RoutesRecognized = new RoutesRecognized(1, `/user/my/questions`, '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };

        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };

        const completion = new UserActions.LoadUserPublishedQuestionsSuccess(publishedQuestions);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: publishedQuestions });
        const expected = cold('--b', { b: completion });
        questionService.getUserQuestions = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserPublishedRouteQuestions$).toBeObservable(expected);
    });

});
