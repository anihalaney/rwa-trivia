import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { Actions } from '@ngrx/effects';
import { TEST_DATA } from '../../../testing/test.data';
import { SocialEffects } from './social.effects';
import { SocialService } from '../../../core/services/social.service';
import {
    AddSubscriber, AddSubscriberSuccess, GetTotalSubscriber, GetTotalSubscriberSuccess, CheckSubscriptionStatus,
    AddSubscriberError
} from '../actions';
import { Subscription, User, Subscribers } from '../../../model';
import { StoreModule, Store } from '@ngrx/store';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { CONFIG } from '../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationProvider, AuthInterceptor } from '../../../../app/core/auth';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { UserService } from '../../../core/services';
import { UserActions } from '../../../core/store/actions';

export const firebaseConfig: FirebaseAppConfig = CONFIG.firebaseConfig;


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
                {
                    provide: SocialService,
                    useValue: { getTotalSubscription: jest.fn(), checkSubscription: jest.fn(), saveSubscription: jest.fn() },
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

        effects = TestBed.get(SocialEffects);
        socialService = TestBed.get(SocialService);
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



});

