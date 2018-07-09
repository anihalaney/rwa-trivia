import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { Actions } from '@ngrx/effects';

import { TEST_DATA } from '../../../testing/test.data';
import { SocialEffects } from './social.effects';
import * as socialActions from '../../../social/store/actions';
import { SocialService } from '../../../core/services/social.service';
import { AddSubscriber, AddSubscriberSuccess, GetTotalSubscriber, GetTotalSubscriberSuccess, CheckSubscriptionStatus } from '../actions';
import { Subscription, User, Subscribers } from '../../../model';
import { StoreModule, Store } from '@ngrx/store';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { CONFIG } from '../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationProvider, AuthInterceptor } from '../../../../app/core/auth';
export const firebaseConfig: FirebaseAppConfig = CONFIG.firebaseConfig;
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { UserService } from '../../../core/services';
import { UserActions } from '../../../core/store/actions'

// import 'jest-preset-angular';
// import './jestGlobalMocks';

describe('Effects: SocialEffects', () => {
    let effects: SocialEffects;
    let actions$: Observable<any>;
    let socialService: any;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({}), AngularFireModule.initializeApp(firebaseConfig),
                AngularFirestoreModule, AngularFirestoreModule, HttpClientModule, AngularFireStorageModule],
            providers: [
                AngularFirestore,
                SocialEffects,
                SocialService,
                UserActions,
                UserService,
                provideMockActions(() => actions$),
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                }
            ],
        });

        effects = TestBed.get(SocialEffects);
        socialService = TestBed.get(SocialService);
        actions$ = TestBed.get(Actions);
    });

    it('getTotalSubscription', () => {
        const subscribers = new Subscribers();
        subscribers.count = 3;
        const action = new GetTotalSubscriber();
        const completion = new GetTotalSubscriberSuccess(subscribers);
        actions$ = hot('--a-', { a: action });
        const response = cold('-a|', { a: subscribers });
        const expected = cold('--b', { b: completion });
        // socialService.getTotalSubscription = jest.fn(() => response);

        expect(effects.getTotalSubscription$).toBeObservable(expected);
    });

    // it('addSubscription for normal user', () => {
    //     const obj = new Subscription();
    //     obj.email = 'test@test.com';
    //     const action = new AddSubscriber({ subscription: obj });
    //     const completion = new CheckSubscriptionStatus(true);
    //     actions$ = hot('--a-', { a: action });
    //     const response = cold('-a|', { a: obj });
    //     const expected = cold('--b', { b: completion });
    //     socialService.checkSubscription = response;

    //     expect(effects.getTotalSubscription$).toBeObservable(expected);
    // });

    // it('addSubscription for normal user and save value', () => {
    //     const obj = new Subscription();
    //     obj.email = 'test@test.com';
    //     const action = new AddSubscriber({ subscription: obj });
    //     const completion = new CheckSubscriptionStatus(false);
    //     actions$ = hot('--a-', { a: action });
    //     const response = cold('-a|', { a: obj });
    //     const expected = cold('--b', { b: completion });
    //     socialService.checkSubscription = response;
    //     expect(socialActions.CheckSubscriptionStatus).toBeFalsy();
    //     socialService.saveSubscription(obj);

    //     expect(effects.getTotalSubscription$).toBeObservable(expected);
    // });

    // it('addSubscription for logged in user', () => {
    //     const user: User = { ...TEST_DATA.userList[0] };
    //     const obj = new Subscription();
    //     obj.email = user.email;
    //     obj.userId = user.userId;
    //     const action = new AddSubscriber({ subscription: obj });
    //     const completion = new CheckSubscriptionStatus(true);
    //     actions$ = hot('--a-', { a: action });
    //     const response = cold('-a|', { a: obj });
    //     const expected = cold('--b', { b: completion });
    //     socialService.checkSubscription = response;

    //     expect(effects.getTotalSubscription$).toBeObservable(expected);
    // });

    // it('addSubscription for  logged in and save value', () => {
    //     const user: User = { ...TEST_DATA.userList[0] };
    //     const obj = new Subscription();
    //     obj.email = user.email;
    //     obj.userId = user.userId;
    //     const action = new AddSubscriber({ subscription: obj });
    //     const completion = new CheckSubscriptionStatus(false);
    //     actions$ = hot('--a-', { a: action });
    //     const response = cold('-a|', { a: obj });
    //     const expected = cold('--b', { b: completion });
    //     socialService.checkSubscription = response;
    //     expect(socialActions.CheckSubscriptionStatus).toBeFalsy();
    //     socialService.saveSubscription(obj);

    //     expect(effects.getTotalSubscription$).toBeObservable(expected);
    // });
});

