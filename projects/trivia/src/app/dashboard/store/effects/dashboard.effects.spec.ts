import { Observable } from 'rxjs';
import { StatsService, UserService, Utils, SocialService, AchievementService, QuestionService } from 'shared-library/core/services';
import { TestBed, async } from '@angular/core/testing';
import * as dashboardActions from '../actions/dashboard.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jest-marbles';
import { testData } from 'test/data';
import { User, Game, Subscribers, RouterStateUrl } from 'shared-library/shared/model';
import { DashboardEffects } from './dashboard.effects';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, ActionWithPayload } from 'shared-library/core/store';
import { of } from 'rxjs';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RoutesRecognized } from '@angular/router';



describe('DashboardEffects', () => {
    let effects: DashboardEffects;
    let actions$: Observable<any>;
    let socialService: SocialService;
    let userService: UserService;
    let utils: Utils;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const user: User = testData.userList[0];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({})],
            providers: [
                // DashboardActions,
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
                    initialState: { coreState: {} },
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
        // userService = TestBed.get(UserService);
        // utils = TestBed.get(Utils);
        actions$ = TestBed.get(Actions);
        mockStore.refreshState();
    }));

    // addSubscription
    it('Add Subscription', () => {
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
        categoryList = [{
            id: '', type : ''
        }]
        const action = new dashboardActions.LoadLeaderBoard();
        const completion = new dashboardActions.GetTotalSubscriberSuccess(subscribers);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: subscribers });
        const expected = cold('--b', { b: completion });
        socialService.getTotalSubscription = jest.fn(() => {
            return response;
        });
        expect(effects.LoadLeaderBoardInfo$).toBeObservable(expected);
    });

});
