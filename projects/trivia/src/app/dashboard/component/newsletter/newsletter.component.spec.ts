import { TestBed, ComponentFixture, async, fakeAsync, inject } from '@angular/core/testing';
import { NewsletterComponent } from './newsletter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { User, Subscription } from '../../../../../../shared-library/src/lib/shared/model';
import { AppState, appState } from '../../../store';
import { FormBuilder } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoreState } from 'shared-library/core/store';
import { DashboardState } from '../../store';
import { TEST_DATA } from '../../../testing/test.data';

// create new instance of FormBuilder
const formBuilder: FormBuilder = new FormBuilder();

describe('NewsletterComponent', () => {

  let component: NewsletterComponent;
  let fixture: ComponentFixture<NewsletterComponent>;
  let user: User;
  let mockStore: MockStore<AppState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState> | Partial<DashboardState>>;


  beforeEach(async(() => {

    TestBed.configureTestingModule({

      imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({})],
      // providers: [ Store ],
      providers: [provideMockStore({
        initialState: {},
        selectors: [
          {
            selector: appState.coreState,
            value: {
              user: null,
            }
          },
          {
            selector: appState.dashboardState,
            value: {
              checkEmailSubscriptionStatus: true,
              getTotalSubscriptionStatus: {
                count: 0
              }
            }
          }
        ]
      })],
      declarations: [NewsletterComponent],
    });
    // create component and NewsletterComponent fixture
    fixture = TestBed.createComponent(NewsletterComponent);

    // get NewsletterComponent component from the fixture
    component = fixture.componentInstance;
    component.user = user;
    fixture = TestBed.createComponent(NewsletterComponent);
    mockStore = TestBed.get(Store);
    spy = spyOn(mockStore, 'dispatch');
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('form invalid when empty', () => {
    expect(component.subscriptionForm.valid).toBeFalsy();
  });


  it('email field validity', () => {
    let errors = {};
    const email = component.subscriptionForm.controls['email'];

    // Email field is required
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set incorrect value to email
    email.setValue('test');
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Set correct value to email
    email.setValue('demo@example.com');
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it(`Initially total count should be zero `, () => {
    expect(component.totalCount).toBe(0)
  });

  it(`Update total count should not be zero `, () => {

    mockStore.overrideSelector<AppState, Partial<DashboardState>>(appState.dashboardState, {
      getTotalSubscriptionStatus: {
        count: 10
      }
    });
    mockStore.refreshState();
    expect(component.totalCount).toBe(10)
  });

  it(`Subscription for already subscribed user `, () => {
    expect(component.message).toBe('This EmailId is already Subscribed!!')
  });

  it(`Subscription for first time user subscribed user `, () => {

    mockStore.overrideSelector<AppState, Partial<DashboardState>>(appState.dashboardState, {
      checkEmailSubscriptionStatus: false,
    });

    mockStore.refreshState();
    expect(component.message).toBe('Your EmailId is Successfully Subscribed!!')
  });

  it('Subscription for normal user', () => {

    expect(component.subscriptionForm.valid).toBeFalsy();
    component.subscriptionForm.controls['email'].setValue('test@test.com');
    expect(component.subscriptionForm.valid).toBeTruthy();

    // dispatch service to save subscribe email

    const subscription = new Subscription();
    subscription.email = component.subscriptionForm.controls['email'].value;

    spy.and.callFake((action: any) => {
      expect(action.AddSubscriber);
      expect(action.payload.subscription).toEqual(subscription);
    });

    // Trigger the subscribe function
    component.onSubscribe();

    expect(mockStore.dispatch).toHaveBeenCalled();

    // Now we can check to make sure the emitted value is correct
    expect(component.subscriptionForm.get('email').value).toBe('test@test.com');
  });


  it('subscription for logged in user', () => {
    expect(component.subscriptionForm.valid).toBeFalsy();
    user = { ...TEST_DATA.userList[0] };
    component.user = user;
    component.subscriptionForm.controls['email'].setValue(user.email);
    expect(component.subscriptionForm.valid).toBeTruthy();

    // dispatch service to save subscribe email

    const subscription = new Subscription();
    subscription.email = user.email;
    if (user) {
      subscription.userId = user.userId;
    }

    spy.and.callFake((action: any) => {
      expect(action.AddSubscriber);
      expect(action.payload.subscription).toEqual(subscription);
    });

    // Trigger the subscribe function
    component.onSubscribe();

    expect(mockStore.dispatch).toHaveBeenCalled();

    // Now we can check to make sure the emitted value is correct
    expect(component.subscriptionForm.get('email').value).toBe(user.email);
    expect(component.user.userId).toBe(user.userId);
  });

});
