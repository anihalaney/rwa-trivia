import 'reflect-metadata';
import { UserFeedbackComponent } from 'shared-library/shared/mobile/component/user-feedback/user-feedback.component';
import { Utils } from 'shared-library/core/services/utils';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { coreState, CoreState, UserActions, ActionWithPayload } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { User } from 'shared-library/shared/model';
import { testData } from 'test/data';


describe('UserFeedbackComponent', async () => {

    let component: UserFeedbackComponent;
    let fixture: ComponentFixture<UserFeedbackComponent>;
    let user: User;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    let spy: any;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([UserFeedbackComponent], [
        {
            provide: Utils,
            useValue: {
                showMessage(type: string, message: string) { },
                hideKeyboard() { }
            }
        },
        FormBuilder,
        UserActions,
        provideMockStore({
            initialState: {},
            selectors: [
                {
                    selector: coreState,
                    value: {}
                }
            ]
        }),
    ],
        [StoreModule.forRoot({})]
    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(UserFeedbackComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        spy = spyOn(mockStore, 'dispatch');
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on load component should set user', () => {
        user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.user).toEqual(user);
    });

    it('Verify when store emit feedback status it should show message', () => {
        user = testData.userList[0];
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        mockCoreSelector.setResult({ feedback: 'SUCCESS' });
        mockStore.refreshState();
        component.ngOnInit();
        expect(spyMessage).toHaveBeenCalled();


    });

    it('Form should have email required error when email is not set', () => {
        expect(component.feedbackForm.get('email').errors).toEqual({ 'required': true });
        expect(component.feedbackForm.get('feedback').errors).toEqual({ 'required': true });
    });

    it('Form should have email invalid error when email is not set', () => {
        component.feedbackForm.get('email').setValue('test');
        // tslint:disable-next-line: max-line-length
        const expectedResult = {
            'pattern': {
                // tslint:disable-next-line: max-line-length
                'actualValue': 'test', 'requiredPattern': '/^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/'
            }
        };
        expect(component.feedbackForm.get('email').errors).toEqual(expectedResult);

    });


    it('Form should have feedback min error if user has entered feedback less than min characters', () => {
        component.feedbackForm.get('feedback').setValue('test');
        const expectedResult = { minlength: { requiredLength: 15, actualLength: 4 } };
        expect(component.feedbackForm.get('feedback').errors).toEqual(expectedResult);
    });

    it('Form should have feedback max error if user has entered feedback less than max characters', () => {
        // tslint:disable-next-line: max-line-length
        component.feedbackForm.get('feedback').setValue('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.');
        const expectedResult = { maxlength: { requiredLength: 200, actualLength: 361 } };
        expect(component.feedbackForm.get('feedback').errors).toEqual(expectedResult);
    });

    it(`Verify when user logged in then it should set logged in user's email id in email field `, () => {
        user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.feedbackForm.get('email').value).toBe('priyankamavani99+124@gmail.com');
    });

    it(`Verify Form should reset on click on resetForm`, () => {
        user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.resetForm();
        expect(component.feedbackForm.get('email').value).toBe('priyankamavani99+124@gmail.com');
        expect(component.feedbackForm.get('feedback').value).toBe(null);
    });

    it(`Verify on onSubmit it should show error message`, () => {
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.onSubmit();
        expect(spyMessage).toHaveBeenCalled();
    });

    it(`Verify on onSubmit it should dispatch event to save feedback`, () => {
        user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.feedbackForm.get('feedback').setValue('Lorem ipsum dolor sit amet, consectetuer');
        const payload = {
            email: 'priyankamavani99+124@gmail.com',
            feedback: 'Lorem ipsum dolor sit amet, consectetuer',
            user_id: user.userId
        };
        spy.and.callFake((action: ActionWithPayload<any>) => {
            expect(action.type).toEqual(UserActions.ADD_FEEDBACK);
            expect(action.payload).toEqual(payload);
        });

        component.onSubmit();
        expect(spy).toHaveBeenCalled();

    });

    it(`Verify on call hideKeyboard it should hide keyboard`, () => {
        const services = TestBed.get(Utils);
        const spyHideKeyboard = spyOn(services, 'hideKeyboard');
        component.hideKeyboard();
        expect(spyHideKeyboard).toHaveBeenCalled();
    });

});
