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
import { dashboardState, reducer } from './../../store/reducers/index'
import { CoreState, coreState } from 'shared-library/core/store';


// create new instance of FormBuilder
const formBuilder: FormBuilder = new FormBuilder();

describe('NewsletterComponent', () => {

    let component: NewsletterComponent;
    let fixture: ComponentFixture<NewsletterComponent>;
    let user: User;
    let mockStore:  MockStore<AppState>;
    let mockUsernameSelector: MemoizedSelector<AppState, CoreState>;

    let user1 = { email: null };
    beforeEach(async(() => {

        TestBed.configureTestingModule({

            imports: [ReactiveFormsModule, FormsModule],
            // providers: [ Store ],
            providers: [
                provideMockStore(),
                { provide: FormBuilder, useValue: formBuilder }
            ],
            declarations: [NewsletterComponent],
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(NewsletterComponent);
                mockStore = TestBed.get(Store);
                mockUsernameSelector = mockStore.overrideSelector(coreState, { user: user });
                // mockUsernameSelector.setResult({ coreState: { user } });
                component = fixture.componentInstance;
                fixture.detectChanges();

            });;
    }));

    beforeEach(() => {
        // let user: User = { email: null };
        // _store.resetSelectors();
        // // _store.overrideSelector(coreState['user'] , user);
        // _store.setState({ coreState: { user: user } });

        fixture.detectChanges();
    });

    afterEach(() => { fixture.destroy(); });


    // beforeEach(inject([Store], (store: MockStore<AppState>) => {
    //     store.nextMock({
    //         isAdmin: false
    //     }, 'account');
    // }));


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('form invalid when empty', () => {
    //     component.subscriptionForm.controls['email'].setValue('demn@demo.com');
    //     fixture.detectChanges();
    //     component.onSubscribe();
    //     expect(component.subscriptionForm.valid).toBeTruthy()
    // });

    // it(`Subscription for already subscribed user `, () => {
    //     // mockStore = TestBed.get(Store);
    //     // formErrors = mockStore.overrideSelector(reducer.checkEmailSubscriptionStatus, true);
    //     fixture.detectChanges();
    //     component.onSubscribe();
    //     expect(component.message).toBe('This EmailId is already Subscribed!!')
    // });

    // it(`Subscription for first time user subscribed user `, () => {
    //     component.onSubscribe();
    //     let storeMock = new StoreMock;
    //     // Trying to inject another mock
    //     storeMock.final.checkEmailSubscriptionStatus = false;

    //     TestBed.overrideProvider(Store, { useValue: StoreMock1 });
    //     fixture.detectChanges();
    //     // _store = fixture.debugElement.injector.get(Store);
    //     component.onSubscribe();

    //     expect(component.message).toBe('Your EmailId is Successfully Subscribed!!')
    // });


});



