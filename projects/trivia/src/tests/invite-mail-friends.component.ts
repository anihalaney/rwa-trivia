import 'reflect-metadata';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';
import { InviteMailFriendsComponent } from 'shared-library/shared/components/invite-mail-friends/invite-mail-friends.component';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions, ActionWithPayload } from 'shared-library/core/store';
import { Utils  } from 'shared-library/core/services';
import { testData } from 'test/data';

describe('InviteMailFriendsComponent', () => {
    let component: InviteMailFriendsComponent;
    let fixture: ComponentFixture<InviteMailFriendsComponent>;
    let mockStore: MockStore<CoreState>;
    let spy: any;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach (
        [InviteMailFriendsComponent],
        [UserActions,
            {
                provide: Utils,
                useValue: {
                    hideKeyboard() {
                        return '';
                    }
                }
            },
            provideMockStore({
                initialState: {},
                selectors: [
                    {
                        selector: coreState,
                        value: {}
                    }
                ]
            })
        ],
        [ReactiveFormsModule, NativeScriptFormsModule, StoreModule.forRoot({})]
    ));
    beforeEach((async () => {
        fixture = await nsTestBedRender(InviteMailFriendsComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        spy = spyOn(mockStore, 'dispatch');
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Form should be default invalid', () => {

        const spy = spyOn(component.utils, 'hideKeyboard').and.callThrough();
        expect(spy);
        component.hideKeyboard();
        expect(component.utils.hideKeyboard).toHaveBeenCalled();

        expect(component.invitationForm.valid).toBeFalsy();
    });

    it('on load component should have empty message', () => {
        expect(component.errorMsg).toEqual('');
    });

    it('on load component should not show error message', () => {
        component.invitationForm.get('email').setValue('test@test.com');
        expect(component.showErrorMsg).toBeFalsy();
    });

    it(`on load component user should set`, () => {
        mockCoreSelector.setResult({ user: testData.userList[0] });
        mockStore.refreshState();
        expect(component.user).toEqual(testData.userList[0]);
    });

    it('on load component should set applicationSettings', () => {
        mockCoreSelector.setResult({ applicationSettings: [testData.applicationSettings] });
        mockStore.refreshState();
        expect(component.applicationSettings).toEqual(testData.applicationSettings);
    });

    it('Form should have email required error when email is not set', () => {
        expect(component.invitationForm.get('email').errors).toEqual({ 'required': true });
    });

    it('Form should be valid when valid email is provided', () => {
        component.invitationForm.get('email').setValue('test@test.com');
        expect(component.invitationForm.valid).toBeTruthy();
    });


    it('Check isValid will return true if email is valid', () => {
        expect(component.isValid('test@test.com')).toBeTruthy();
    });

    it(`Email value 'test' should make isValid function to return false`, () => {
        expect(component.isValid('test')).toBeFalsy();
    });

    it(`Email value 'test@test' should make isValid function to return false`, () => {
        expect(component.isValid('test@test')).toBeFalsy();
    });

    it(`Email value 'test@test.' should make isValid function to return false`, () => {
        expect(component.isValid('test@test.')).toBeFalsy();
    });

    it(`Error message should be set when wrong email is entered`, () => {
        component.invitationForm.controls['email'].setValue('test@test');
        component.onSubscribe();
        expect(component.errorMsg).toBe('Following email is not valid address!');
    });


    // tslint:disable-next-line: max-line-length
    it(`on Subscribe check if email is invalid then invalid email will add into invalid email list and show error msg should be false `, () => {
        component.invitationForm.controls['email'].setValue('test@test');
        component.onSubscribe();
        expect(component.showErrorMsg).toBeTruthy();
        expect(component.invalidEmailList.length).toEqual(1);
    });

    it(`on Subscribe errorMsg message should be set if wrong multiple email inserted `, () => {
        component.invitationForm.controls['email'].setValue('test@test,second.mail');
        component.onSubscribe();
        expect(component.errorMsg).toBe('Following emails are not valid address!');
    });


    it(`on Subscribe show error message should be true set if invalid single email inserted`, () => {
        component.invitationForm.controls['email'].setValue('test@test,second.mail');
        component.onSubscribe();
        expect(component.showErrorMsg).toBeTruthy();
        expect(component.invalidEmailList.length).toEqual(2);
    });


    it(`on Subscribe invalid email should push on invalidEmailList list should 1`, () => {
        component.invitationForm.controls['email'].setValue('test@test,test@mail.com');
        component.onSubscribe();
        expect(component.invalidEmailList.length).toEqual(1);
    });

    it(`on Subscribe valid email should push on validEmail list length should be 2`, () => {
        component.invitationForm.controls['email'].setValue('test@test,test@mail.com,trivia@mail.com');
        component.onSubscribe();
        expect(component.validEmail.length).toEqual(2);
    });

    it(`on Subscribe should dispatch action to add user invitation with correct payload `, () => {
        component.invitationForm.controls['email'].setValue('trivia@mail.com');
        const user = { ...testData.userList[0] };
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();

        const payloadData = {
            userId: user.userId,
            emails: ['trivia@mail.com']
        };

        spy.and.callFake((action: ActionWithPayload<string>) => {
            expect(action.type).toEqual(UserActions.ADD_USER_INVITATION);
            expect(action.payload).toEqual(payloadData);
        });

        component.onSubscribe();
        expect(mockStore.dispatch).toHaveBeenCalled();
    });

    it(`Invitation message should set to showSuccessMsg`, () => {
        const userProfileSaveStatus = 'Invitation is sent on user@user.com';
        mockCoreSelector.setResult({ userProfileSaveStatus });
        mockStore.refreshState();
        expect(component.showSuccessMsg).toEqual(userProfileSaveStatus);
    });

    it(`Invitation message should not set to showSuccessMsg if it status is 'NONE'`, () => {
        const userProfileSaveStatus = 'NONE';
        mockCoreSelector.setResult({ userProfileSaveStatus });
        mockStore.refreshState();
        expect(component.showSuccessMsg).toBeUndefined();
    });

    it(`Invitation message should not set to showSuccessMsg if it status is 'IN PROCESS'`, () => {
        const userProfileSaveStatus = 'IN PROCESS';
        mockCoreSelector.setResult({ userProfileSaveStatus });
        mockStore.refreshState();
        expect(component.showSuccessMsg).toBeUndefined();
    });

    it(`Invitation message should not set to showSuccessMsg if it status is 'SUCCESS'`, () => {
        const userProfileSaveStatus = 'SUCCESS';
        mockCoreSelector.setResult({ userProfileSaveStatus });
        mockStore.refreshState();
        expect(component.showSuccessMsg).toBeUndefined();
    });

    it(`Invitation message should not set to showSuccessMsg if it status is 'MAKE FRIEND SUCCESS'`, () => {
        const userProfileSaveStatus = 'MAKE FRIEND SUCCESS';
        mockCoreSelector.setResult({ userProfileSaveStatus });
        mockStore.refreshState();
        expect(component.showSuccessMsg).toBeUndefined();
    });
});
