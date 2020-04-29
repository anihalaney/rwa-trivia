import { TestBed, ComponentFixture, async, fakeAsync, inject } from '@angular/core/testing';
import { NewsletterComponent } from './newsletter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { User, Subscription } from '../../../../../../shared-library/src/lib/shared/model';
import { of } from 'rxjs';
// import { MockStore } from 'shared-library/testing';
import { AppState, appState } from '../../../store';
import { FormBuilder } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoreState, coreState } from 'shared-library/core/store';


// create new instance of FormBuilder
const formBuilder: FormBuilder = new FormBuilder();

describe('NewsletterComponent', () => {

  let component: NewsletterComponent;
  let fixture: ComponentFixture<NewsletterComponent>;
  let user: User;
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;


  beforeEach(async(() => {

    TestBed.configureTestingModule({

      imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({})],
      // providers: [ Store ],
      providers: [ provideMockStore( {
        initialState: { core: {}, dashboard: {}},
        // selectors: [
        //   // {
        //   //   selector: appState.coreState,
        //   //   value: {
        //   //     user: null,
        //   //   }
        //   // },
        //   {
        //     selector: appState.dashboardState,
        //     value: {
        //       // checkEmailSubscriptionStatus: null,
        //       // getTotalSubscriptionStatus: {
        //       //   count: 0
        //       // }
        //     }
        //   }
        // ]
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
    mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, { user: user });
    mockCoreSelector.setResult( user );
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

//     beforeEach(() => {
//         // let user: User = { email: null };
//         // _store.resetSelectors();
//         // // _store.overrideSelector(coreState['user'] , user);
//         // _store.setState({ coreState: { user: user } });

//         fixture.detectChanges();
//     });

//     afterEach(() => { fixture.destroy(); });


//     // beforeEach(inject([Store], (store: MockStore<AppState>) => {
//     //     store.nextMock({
//     //         isAdmin: false
//     //     }, 'account');
//     // }));


//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

    it('form invalid when empty', () => {
        component.subscriptionForm.controls['email'].setValue('demn@demo.com');
        fixture.detectChanges();
        component.onSubscribe();
        expect(component.subscriptionForm.valid).toBeTruthy();
    });

//     // it(`Subscription for already subscribed user `, () => {
//     //     // mockStore = TestBed.get(Store);
//     //     // formErrors = mockStore.overrideSelector(reducer.checkEmailSubscriptionStatus, true);
//     //     fixture.detectChanges();
//     //     component.onSubscribe();
//     //     expect(component.message).toBe('This EmailId is already Subscribed!!')
//     // });

//     // it(`Subscription for first time user subscribed user `, () => {
//     //     component.onSubscribe();
//     //     let storeMock = new StoreMock;
//     //     // Trying to inject another mock
//     //     storeMock.final.checkEmailSubscriptionStatus = false;

//     //     TestBed.overrideProvider(Store, { useValue: StoreMock1 });
//     //     fixture.detectChanges();
//     //     // _store = fixture.debugElement.injector.get(Store);
//     //     component.onSubscribe();

//     //     expect(component.message).toBe('Your EmailId is Successfully Subscribed!!')
//     // });


});
