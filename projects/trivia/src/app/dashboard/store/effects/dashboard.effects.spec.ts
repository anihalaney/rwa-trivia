import { Observable } from 'rxjs';
import { StatsService, SocialService, AchievementService, QuestionService } from 'shared-library/core/services';
import { TestBed, async } from '@angular/core/testing';
import * as dashboardActions from '../actions/dashboard.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jest-marbles';
import { testData } from 'test/data';
import { User, Subscription, Subscribers, RouterStateUrl, SystemStats, AchievementRule } from 'shared-library/shared/model';
import { DashboardEffects } from './dashboard.effects';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState } from 'shared-library/core/store';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RoutesRecognized } from '@angular/router';



describe('DashboardEffects', () => {
    let effects: DashboardEffects;
    let actions$: Observable<any>;
    let socialService: SocialService;
    let questionService: QuestionService;
    let achievementService: AchievementService;
    let statsService: StatsService;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const user: User = testData.userList[0];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({})],
            providers: [
                {
                    provide: SocialService,
                    useValue: {}
                },
                {
                    provide: StatsService,
                    useValue: {}
                },
                {
                    provide: AchievementService,
                    useValue: {}
                },
                {
                    provide: QuestionService,
                    useValue: {}
                },
                DashboardEffects,
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
        effects = TestBed.get(DashboardEffects);
        socialService = TestBed.get(SocialService);
        statsService = TestBed.get(StatsService);
        achievementService = TestBed.get(AchievementService);
        questionService = TestBed.get(QuestionService);
        actions$ = TestBed.get(Actions);
        mockStore.refreshState();
    }));

    // addSubscription
    it('Add Subscription', () => {

        const subscription: Subscription = new Subscription();
        subscription.userId = user.userId;
        subscription.email = 'demo@demo.com';

        const action = new dashboardActions.AddSubscriber({ subscription });
        const completion = new dashboardActions.CheckSubscriptionStatus(true);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: true });
        const expected = cold('--b', { b: completion });
        socialService.checkSubscription = jest.fn(() => {
            return response;
        });
        expect(effects.addSubscription$).toBeObservable(expected);

    });


    // addSubscription
    it('Add Subscription', () => {

        const subscription: Subscription = new Subscription();
        subscription.userId = user.userId;
        subscription.email = 'demo@demo.com';

        const action = new dashboardActions.AddSubscriber({ subscription });
        const completion = new dashboardActions.CheckSubscriptionStatus(false);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: false });
        const expected = cold('--b', { b: completion });

        socialService.checkSubscription = jest.fn(() => {
            return response;
        });

        socialService.saveSubscription = jest.fn(() => {
            return response;
        });

        expect(effects.addSubscription$).toBeObservable(expected);

    });


    // addSubscription
    it('Add Subscription it should call saveSubscription', () => {

        const subscription: Subscription = new Subscription();
        subscription.userId = user.userId;
        subscription.email = 'demo@demo.com';
        const action = new dashboardActions.AddSubscriber({ subscription });

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: false });

        socialService.checkSubscription = jest.fn(() => {
            return response;
        });

        const mockService = socialService.saveSubscription = jest.fn(() => {
            return response;
        });

        effects.addSubscription$.subscribe(res => {
            expect(mockService).toHaveBeenCalled();
        });

    });

    // addSubscription throws Error
    it('Add Subscription: throws Error', () => {

        const subscription: Subscription = new Subscription();
        subscription.userId = user.userId;
        subscription.email = 'demo@demo.com';

        const action = new dashboardActions.AddSubscriber({ subscription });
        const completion = new dashboardActions.AddSubscriberError('Error while getting blogs');
        const error = 'Error while getting blogs';

        actions$ = hot('-a---', { a: action });
        const response = cold('-#|', {}, error);
        const expected = cold('--b', { b: completion });

        socialService.checkSubscription = jest.fn(() => {
            return response;
        });

        socialService.saveSubscription = jest.fn(() => { });

        expect(effects.addSubscription$).toBeObservable(expected);

    });


    it('Add Subscription ', () => {

        const subscription: Subscription = new Subscription();
        subscription.userId = user.userId;
        subscription.email = 'demo@demo.com';

        const action = new dashboardActions.AddSubscriber({ subscription });
        const completion = new dashboardActions.CheckSubscriptionStatus(true);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: true });
        const expected = cold('--b', { b: completion });
        socialService.checkSubscription = jest.fn(() => {
            return response;
        });
        expect(effects.addSubscription$).toBeObservable(expected);

    });

    // getTotalSubscription
    it('Get TotalSubscription', () => {
        const subscribers: Subscribers = new Subscribers();
        subscribers.count = 10;
        const action = new dashboardActions.GetTotalSubscriber();
        const completion = new dashboardActions.GetTotalSubscriberSuccess(subscribers);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: subscribers });
        const expected = cold('--b', { b: completion });
        socialService.getTotalSubscription = jest.fn(() => {
            return response;
        });
        expect(effects.getTotalSubscription$).toBeObservable(expected);
    });

    // loadSocialScoreShareUrl
    it('loadSocialScoreShareUrl', () => {

        const imageString = testData.imageString[0].data;

        // Convert the string to bytes
        const bytes = new Uint8Array(imageString.length / 2);

        for (let i = 0; i < imageString.length; i += 2) {
            bytes[i / 2] = parseInt(imageString.substring(i, i + 2), 16);
        }

        const uploadTaskSnapshot: any = {
            bytesTransferred: 10,
            downloadURL: null,
            metadata: '',
            ref: '',
            state: '',
            task: '',
            totalBytes: 10
        };
        // Make a Blob from the bytes
        const blob = new Blob([bytes], { type: 'image/bmp' });

        const action = new dashboardActions.LoadSocialScoreShareUrl({ imageBlob: blob, userId: user.userId });
        const completion = new dashboardActions.LoadSocialScoreShareUrlSuccess(uploadTaskSnapshot);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: uploadTaskSnapshot });
        const expected = cold('--b', { b: completion });
        socialService.generateScoreShareImage = jest.fn(() => {
            return response;
        });
        expect(effects.loadSocialScoreShareUrl$).toBeObservable(expected);
    });


    // getBlogs
    it('getBlogs', () => {
        const blogs = testData.blogs;
        const completion = new dashboardActions.LoadBlogsSuccess(blogs);

        const routerState: RouterStateUrl = { url: '/', queryParams: {}, params: {} };
        const event: RoutesRecognized = new RoutesRecognized(1, '/', '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };
        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: blogs });
        const expected = cold('--b', { b: completion });

        socialService.loadBlogs = jest.fn(() => {
            return response;
        });
        expect(effects.getBlogs$).toBeObservable(expected);
    });

    // getBlogs throws Error
    it('getBlogs throws Error', () => {

        const completion = new dashboardActions.LoadBlogsError('Error while getting blogs');
        const error = 'Error while getting blogs';
        const routerState: RouterStateUrl = { url: '/', queryParams: {}, params: {} };
        const event: RoutesRecognized = new RoutesRecognized(1, '/', '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };
        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };
        actions$ = hot('-a---', { a: action });
        const response = cold('-#|', {}, error);
        const expected = cold('--b', { b: completion });

        socialService.loadBlogs = jest.fn(() => {
            return response;
        });
        expect(effects.getBlogs$).toBeObservable(expected);
    });

    // LoadLeaderBoardInfo
    it('LoadLeaderBoardInfo', () => {
        const categoryList = {
            data: [
                { id: '1', type: 'category' },
                { id: '2', type: 'category' },
                { id: '3', type: 'category' },
                { id: 'c', type: 'tag' },
            ]
        };

        const leaderBoard = testData.leaderBoard;
        const action = new dashboardActions.LoadLeaderBoard(categoryList);
        const completion = new dashboardActions.LoadLeaderBoardSuccess(leaderBoard);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: leaderBoard });
        const expected = cold('--b', { b: completion });
        statsService.loadLeaderBoardStat = jest.fn(() => {
            return response;
        });
        expect(effects.LoadLeaderBoardInfo$).toBeObservable(expected);
    });


    // LoadSystemStat
    it('LoadSystemStat', () => {


        const systemStats: SystemStats = testData.realTimeStats;
        const action = new dashboardActions.LoadSystemStat();
        const completion = new dashboardActions.LoadSystemStatSuccess(systemStats);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: systemStats });
        const expected = cold('--b', { b: completion });
        statsService.loadSystemStat = jest.fn(() => {
            return response;
        });
        expect(effects.LoadSystemStat$).toBeObservable(expected);
    });

    // LoadSystemStat
    it('LoadSystemStat  throws Error', () => {

        const action = new dashboardActions.LoadSystemStat();
        const completion = new dashboardActions.LoadSystemStatError('Error while getting blogs');
        const error = 'Error while getting blogs';

        actions$ = hot('-a---', { a: action });
        const response = cold('-#|', {}, error);
        const expected = cold('--b', { b: completion });
        statsService.loadSystemStat = jest.fn(() => {
            return response;
        });
        expect(effects.LoadSystemStat$).toBeObservable(expected);
    });


    //   // getAchievements
    it('getAchievements', () => {


        const achievementRules: AchievementRule[] = testData.achievementRules;
        const action = new dashboardActions.LoadAchievements();
        const completion = new dashboardActions.LoadAchievementsSuccess(achievementRules);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: achievementRules });
        const expected = cold('--b', { b: completion });
        achievementService.getAchievements = jest.fn(() => {
            return response;
        });
        expect(effects.getAchievements$).toBeObservable(expected);
    });


    // loadUserLatestPublishedRouteQuestions
    it('loadUserLatestPublishedRouteQuestions', () => {
        const publishedQuestion = testData.questions.published[0];
        const routerState: RouterStateUrl = { url: `/`, queryParams: {}, params: { id: publishedQuestion.id } };
        const event: RoutesRecognized = new RoutesRecognized(1, `/`, '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };

        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };

        const completion = new dashboardActions.LoadUserLatestPublishedQuestionSuccess(publishedQuestion);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: publishedQuestion });
        const expected = cold('--b', { b: completion });
        questionService.getUserLatestQuestion = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserLatestPublishedRouteQuestions$).toBeObservable(expected);
    });

});
