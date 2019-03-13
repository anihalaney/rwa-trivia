import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { Actions } from '@ngrx/effects';
import { TEST_DATA } from '../../../testing/test.data';
import { DashboardEffects } from './dashboard.effects';
import {
    AddSubscriber, AddSubscriberSuccess, GetTotalSubscriber, GetTotalSubscriberSuccess, CheckSubscriptionStatus,
    AddSubscriberError, LoadBlogs, LoadBlogsSuccess, LoadBlogsError, LoadLeaderBoard,
    LoadLeaderBoardSuccess, LoadSystemStat, LoadSystemStatSuccess
} from '../actions';
import { Subscription, User, Subscribers, Blog, RouterStateUrl } from '../../../../../../shared-library/src/lib/shared/model';
import { StoreModule, Store } from '@ngrx/store';
import { AngularFireModule, FirebaseAppConfig } from '@angular/fire';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { CONFIG } from '../../../../../../shared-library/src/lib/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationProvider, AuthInterceptor } from '../../../../../../shared-library/src/lib/core/auth';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { UserService, SocialService, StatsService } from '../../../../../../shared-library/src/lib/core/services';
import { UserActions } from '../../../../../../shared-library/src/lib/core/store';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RoutesRecognized } from '@angular/router';

export const firebaseConfig: FirebaseAppConfig = CONFIG.firebaseConfig;


describe('Effects: DashboardEffects', () => {
    let effects: DashboardEffects;
    let actions$: Observable<any>;
    let socialService: any;
    let statsService: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({}), AngularFireModule.initializeApp(firebaseConfig),
                AngularFirestoreModule, AngularFirestoreModule, HttpClientModule, AngularFireStorageModule],
            providers: [
                AngularFirestore,
                DashboardEffects,
                {
                    provide: SocialService,
                    useValue: {
                        getTotalSubscription: jest.fn(), checkSubscription: jest.fn(), saveSubscription: jest.fn(),
                        LoadBlogsSuccess: jest.fn()
                    },
                },
                {
                    provide: StatsService,
                    useValue: { loadSystemStat: jest.fn(), loadLeaderBoardStat: jest.fn() },
                },
                UserActions,
                UserService,
                provideMockActions(() => actions$),
                {
                    provide: HTTP_INTERCEPTORS,
                    multi: true,
                }
            ],
        });

        effects = TestBed.get(DashboardEffects);
        socialService = TestBed.get(SocialService);
        statsService = TestBed.get(StatsService);
        actions$ = TestBed.get(Actions);
    });

    it('getTotalSubscription', () => {
        const subscribers = new Subscribers();
        subscribers.count = 3;
        const action = new GetTotalSubscriber();
        const completion = new GetTotalSubscriberSuccess(subscribers);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: subscribers });
        const expected = cold('--b', { b: completion });
        socialService.getTotalSubscription = jest.fn(() => response);

        expect(effects.getTotalSubscription$).toBeObservable(expected);
    });

    it('addSubscription for normal user', () => {
        const obj = new Subscription();
        obj.email = 'test@test.com';
        const action = new AddSubscriber({ subscription: obj });
        const completion = new CheckSubscriptionStatus(true);
        actions$ = hot('-a----', { a: action });
        const response = cold('-a|', { a: obj });
        const expected = cold('--b', { b: completion });
        socialService.checkSubscription = jest.fn(() => response);

        expect(effects.addSubscription$).toBeObservable(expected);
    });

    it('addSubscription for normal user throws Error', () => {
        const obj = new Subscription();
        obj.email = 'test@test.com';
        const action = new AddSubscriber({ subscription: obj });
        const completion = new AddSubscriberError('Error while saving Subscription');
        const error = 'Error while saving Subscription';

        actions$ = hot('-a----', { a: action });
        const response = cold('-#|', {}, error);
        const expected = cold('--b', { b: completion });
        socialService.checkSubscription = jest.fn(() => response);

        expect(effects.addSubscription$).toBeObservable(expected);
    });



    it('addSubscription for logged in user', () => {
        const user: User = { ...TEST_DATA.userList[0] };
        const obj = new Subscription();
        obj.email = user.email;
        obj.userId = user.userId;
        const action = new AddSubscriber({ subscription: obj });
        const completion = new CheckSubscriptionStatus(true);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: obj });
        const expected = cold('--b', { b: completion });
        socialService.checkSubscription = jest.fn(() => response);

        expect(effects.addSubscription$).toBeObservable(expected);
    });

    it('addSubscription for logged in user throws Error', () => {
        const user: User = { ...TEST_DATA.userList[0] };
        const obj = new Subscription();
        obj.email = user.email;
        obj.userId = user.userId;
        const action = new AddSubscriber({ subscription: obj });
        const completion = new AddSubscriberError('Error while saving Subscription');
        const error = 'Error while saving Subscription';


        actions$ = hot('-a---', { a: action });
        const response = cold('-#|', {}, error);
        const expected = cold('--b', { b: completion });
        socialService.checkSubscription = jest.fn(() => response);

        expect(effects.addSubscription$).toBeObservable(expected);
    });

    it('get all blogs', () => {
        const obj = TEST_DATA.blog;
        // const action = new LoadBlogs();
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
        const completion = new LoadBlogsSuccess(TEST_DATA.blog);
        actions$ = hot('-a----', { a: action });
        const response = cold('-a|', { a: obj });
        const expected = cold('--b', { b: completion });
        socialService.loadBlogs = jest.fn(() => response);

        expect(effects.getBlogs$).toBeObservable(expected);
    });

    it('get all blogs throws Error', () => {
        const obj = TEST_DATA.blog;
        // const action = new LoadBlogs();
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
        const completion = new LoadBlogsError('Error while getting Blogs');
        const error = 'Error while getting Blogs';


        actions$ = hot('-a---', { a: action });
        const response = cold('-#|', {}, error);
        const expected = cold('--b', { b: completion });
        socialService.loadBlogs = jest.fn(() => response);

        expect(effects.getBlogs$).toBeObservable(expected);
    });

    it('LoadLeaderBoardInfo', () => {
        const data = [];
        data[0] = { '1': [{ 'score': 123, userId: '9K3sL9eHEZYXFZ68oRrW7a6wUmV2' }] };
        const action = new LoadLeaderBoard();
        const completion = new LoadLeaderBoardSuccess(data);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: data });
        const expected = cold('--b', { b: completion });
        statsService.loadLeaderBoardStat = jest.fn(() => response);
        expect(effects.LoadLeaderBoardInfo$).toBeObservable(expected);
    });

    it('LoadSystemStat', () => {
        const data = TEST_DATA.realTimeStats;
        const action = new LoadSystemStat();
        const completion = new LoadSystemStatSuccess(data);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: data });
        const expected = cold('--b', { b: completion });
        statsService.loadSystemStat = jest.fn(() => response);
        expect(effects.LoadSystemStat$).toBeObservable(expected);
    });
});
